import { CHUNK_SIZE } from '@config/constant'
import { URL_PATHS } from '@config/variables'
import { APIService } from '@framework/services/api'

export class Uploader {
  constructor (options, progressCallback) {
    // this must be bigger than or equal to 5MB,
    // otherwise AWS will respond with:
    // 'Your proposed upload is smaller than the minimum allowed size'
    this.chunkSize = options.chunkSize || CHUNK_SIZE
    // number of parallel uploads
    this.threadsQuantity = Math.min(options.threadsQuantity || 5, 15)
    this.file = options.file
    this.fileName = options.fileName
    this.isForSeasonal = options.isForSeasonal
    this.isForSop = options.isForSop
    this.isForOnboarding = options.isForOnboarding
    this.isForWhyItWorks = options.isForWhyItWorks
    this.fieldName = options.fieldName
    this.aborted = false
    this.uploadedSize = 0
    this.progressCache = {}
    this.activeConnections = {}
    this.parts = []
    this.uploadedParts = []
    this.fileId = null
    this.fileKey = null
    this.onProgressFn = () => { /* called when Upload Progress */ }
    this.onErrorFn = () => { /* called when Upload Error */ }
    this.onCompleteFn = () => { /* called when Upload Complete */ };
    this.progressCallback = progressCallback;
  }

  start () {
    this.initialize()
  }

  async initialize () {
    try {
      // adding the the file extension (if present) to fileName
      let fileName = this.fileName

      // initializing the multipart request
      const videoInitializationUploadInput = {
        name: fileName,
        isForSeasonal: this.isForSeasonal,
        isForSop: this.isForSop,
        isForOnboarding: this.isForOnboarding ? this.isForOnboarding : false,
        isForWhyItWorks: this.isForWhyItWorks ? this.isForWhyItWorks : false

      }

      const initializeResponse = await APIService.postData(URL_PATHS.initializeMultipartUpload, videoInitializationUploadInput)

      const AWSFileDataOutput = initializeResponse.data.data

      this.fileId = AWSFileDataOutput.fileId
      this.fileKey = AWSFileDataOutput.fileKey

      // retrieving the pre-signed URLs
      const numberOfParts = Math.ceil(this.file.size / this.chunkSize)

      const AWSMultipartFileDataInput = {
        fileId: this.fileId,
        fileKey: this.fileKey,
        parts: numberOfParts,
        isForSeasonal: this.isForSeasonal,
        isForSop: this.isForSop,
        isForOnboarding: this.isForOnboarding ? this.isForOnboarding : false,
        isForWhyItWorks: this.isForWhyItWorks ? this.isForWhyItWorks : false
      }

      const urlsResponse = await APIService.postData(URL_PATHS.getMultipartPreSignedUrls, AWSMultipartFileDataInput)

      const newParts = urlsResponse.data.data
      this.parts.push(...newParts)

      this.sendNext()
    } catch (error) {
      await this.complete(error)
    }
  }

  sendNext () {
    const activeConnections = Object.keys(this.activeConnections).length

    if (activeConnections >= this.threadsQuantity) {
      return
    }

    if (!this.parts.length) {
      if (!activeConnections) {
        this.complete()
      }

      return
    }

    const part = this.parts.pop()
    if (this.file && part) {
      const sentSize = (part.PartNumber - 1) * this.chunkSize
      const chunk = this.file.slice(sentSize, sentSize + this.chunkSize)

      const sendChunkStarted = () => {
        this.sendNext()
      }

      this.sendChunk(chunk, part, sendChunkStarted)
        .then(() => {
          this.sendNext()
        })
        .catch((error) => {
          this.parts.push(part)

          this.complete(error)
        })
    }
  }

  async complete (error) {
    if (error && !this.aborted) {
      this.onErrorFn(error)
      return
    }

    if (error) {
      this.onErrorFn(error)
      return
    }

    try {
      await this.sendCompleteRequest()
      this.onErrorFn(error)
    } catch (error) {
    }
  }

  async sendCompleteRequest () {
    if (this.fileId && this.fileKey) {
      const videoFinalizationMultiPartInput = {
        fileId: this.fileId,
        fileKey: this.fileKey,
        parts: this.uploadedParts,
        name: this.fileName,
        isForSeasonal: this.isForSeasonal,
        isForSop: this.isForSop,
        isForOnboarding: this.isForOnboarding ? this.isForOnboarding : false,
        isForWhyItWorks: this.isForWhyItWorks ? this.isForWhyItWorks : false
      }
      try {
        const response = await APIService.postData(URL_PATHS.finalizeMultipartUpload, videoFinalizationMultiPartInput);
        this.onCompleteFn(response.data.data.url); // Pass the response to the callback
      } catch (error) {
        this.onErrorFn(error);
      }

    }
  }

  onComplete (callback) {
    this.onCompleteFn = callback;
    return this;
  }

  sendChunk (chunk, part, sendChunkStarted) {
    return new Promise((resolve, reject) => {
      this.upload(chunk, part, sendChunkStarted)
        .then((status) => {
          if (status !== 200) {
            reject(new Error('Failed chunk upload'))
            return
          }

          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  handleProgress (part, event) {
    if (this.file) {
      if (event.type === 'progress' || event.type === 'error' || event.type === 'abort') {
        this.progressCache[part] = event.loaded
      }

      if (event.type === 'uploaded') {
        this.uploadedSize += this.progressCache[part] || 0
        delete this.progressCache[part]
      }

      const inProgress = Object.keys(this.progressCache)
        .map(Number)
        .reduce((memo, id) => (memo + this.progressCache[id]), 0)

      const sent = Math.min(this.uploadedSize + inProgress, this.file.size)

      const total = this.file.size

      const percentage = Math.round((sent / total) * 100)
      this.progressCallback(percentage, this.fieldName);

      this.onProgressFn({
        sent: sent,
        total: total,
        percentage: percentage,
      })
    }
  }

  upload (file, part, sendChunkStarted) {
    // uploading each part with its pre-signed URL
    return new Promise((resolve, reject) => {
      if (this.fileId && this.fileKey) {
        const xhr = (this.activeConnections[part.PartNumber - 1] = new XMLHttpRequest())

        sendChunkStarted()

        const progressListener = this.handleProgress.bind(this, part.PartNumber - 1)

        xhr.upload.addEventListener('progress', progressListener)

        xhr.addEventListener('error', progressListener)
        xhr.addEventListener('abort', progressListener)
        xhr.addEventListener('loadend', progressListener)

        xhr.open('PUT', part.signedUrl)

        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4 && xhr.status === 200) {
            const ETag = xhr.getResponseHeader('ETag')

            if (ETag) {
              const uploadedPart = {
                PartNumber: part.PartNumber,
                ETag: ETag.replaceAll('"', ''),
              }

              this.uploadedParts.push(uploadedPart)

              resolve(xhr.status)
              delete this.activeConnections[part.PartNumber - 1]
            }
          }
        }

        xhr.onerror = (error) => {
          reject(error)
          delete this.activeConnections[part.PartNumber - 1]
        }

        xhr.onabort = () => {
          reject(new Error('Upload canceled by user'))
          delete this.activeConnections[part.PartNumber - 1]
        }

        xhr.send(file)
      }
    })
  }

  onProgress (onProgress) {
    this.onProgressFn = onProgress
    return this
  }

  onError (onError) {
    this.onErrorFn = onError
    return this
  }

  abort () {
    Object.keys(this.activeConnections)
      .map(Number)
      .forEach((id) => {
        this.activeConnections[id].abort()
      })

    this.aborted = true
  }
}

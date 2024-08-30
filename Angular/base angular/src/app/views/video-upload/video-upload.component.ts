import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { FlowDirective, Transfer } from '@flowjs/ngx-flow';
import { Subscription } from 'rxjs';
import { CONFIG } from '../../config/app-config';
import { BaseComponent } from '../../_components/base.component';

@Component({
  selector: 'app-video-upload',
  templateUrl: './video-upload.component.html',
  styleUrls: ['./video-upload.component.scss'],
})
export class VideoUploadComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('flowAdvanced')
  flow: FlowDirective;

  autoUploadSubscription: Subscription;

  model = {
    valid_video: '',
  };
  videoSrc: any;
  videoType = 'video/mp4';
  videoName = '';
  private videoDuration = 0;
  videoExtention: string;
  auth = '';
  isUploadDone = true;
  @ViewChild('videoPlayer') videoplayer: ElementRef;
  @ViewChild('canvasEle') canvas: ElementRef;
  showMainVideo = false;
  flowConfig = {};
  customThumbVal = '';
  thumbList = [];
  showThumb = false;
  private noofThumb = 0;
  private curTime = 0;
  private videoElement: any;
  private canvasElement: any;
  private ctx: any;
  constructor(private domSanitizer: DomSanitizer, private cd: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    this.flowConfig = {
      target: CONFIG.videoUploadURL,
      singleFile: true,
      chunkSize: 10000000, // 10MB
      testChunks: true,
    };
  }
  ngAfterViewInit() {
    this.videoElement = this.videoplayer.nativeElement;
    this.canvasElement = this.canvas.nativeElement;
    this.ctx = this.canvasElement.getContext('2d');
    this.autoUploadSubscription = this.flow.events$.subscribe((event) => {
      // to get rid of incorrect `event.type` type you need Typescript 2.8+
      switch (event.type) {
        case 'fileAdded':
          this.changeVideo(event);
          break;
        case 'filesSubmitted':
          if (this.videoSrc) {
            return this.flow.upload();
          }
          break;
        case 'newFlowJsInstance':
          this.cd.detectChanges();
          break;
        case 'fileSuccess':
          if (this.videoSrc) {
            this.getFlowFileName(event);
          }
          break;
        case 'fileError':
          this.toastr.error('Something went wrong');
          break;
        case 'pauseOrResume':
          this.toastr.error('File pause or resume');
          break;
      }
    });
  }

  ngOnDestroy() {
    this.autoUploadSubscription.unsubscribe();
  }

  trackTransfer(transfer: Transfer) {
    return transfer.id;
  }
  private getFlowFileName(event: any) {
    const fname = event.event[0].file;
    if (fname) {
      this.videoName = fname.name;
      this.isUploadDone = false;
    }
  }
  private async changeVideo(event: any) {
    const vidEvent = event.event[0].file;
    if (vidEvent !== undefined) {
      // allow max 5 GB video
      const vidSize = 5,
        vidSizeMB = vidEvent.size / 1024 / 1024;
      let temp;
      const vidTypes = ['video/mp4', 'video/webm', 'video/m4v', 'video/mpeg', 'video/mpv', 'video/quicktime'];
      if (!vidTypes.includes(vidEvent.type)) {
        const message = await this.getTranslation('PLEASE_UPLOAD_VALID_FILE', 'video');
        this.toastr.error(message);
      } else {
        if ((temp = vidSize) === void 0 || temp === '' || vidSizeMB / 1024 < vidSize) {
          this.model.valid_video = vidEvent;
          this.showMainVideo = true;
          this.videoSrc = this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(vidEvent));
          this.videoType = vidEvent.type;
          this.videoElement.load();
        } else {
          this.toastr.error('Video Size should be smaller than ' + vidSize + 'GB');
        }
      }
    }
  }
  cancelVideo(upld_video) {
    window.location.reload();
  }

  public loadedVideo() {
    this.loader.showLoader();
    let durT, timeSplit, completedDur;
    durT = Math.floor(this.videoElement.duration);
    this.videoDuration = this.videoElement.duration;
    this.curTime = Math.floor(this.videoElement.currentTime);
    // if video duration greater then 120 second then generate 6 thumbnails otherwiser 3 thumbnails
    if (durT >= 120) {
      timeSplit = durT / 6;
      this.noofThumb = 6;
      completedDur = Math.floor(timeSplit) * 6;
    } else {
      timeSplit = durT / 3;
      this.noofThumb = 3;
      completedDur = Math.floor(timeSplit) * 3;
    }
    const videoTime = setInterval(() => {
      if (this.curTime >= completedDur) {
        this.loader.hideLoader();
        // current time 0 when thumb generated
        this.videoElement.currentTime = 0;
        // clear timeout
        clearInterval(videoTime);
      } else {
        this.curTime = this.curTime + timeSplit;
        // update video current time
        this.videoElement.currentTime = this.curTime;
        // Set canvas dimensions same as video dimensions
        this.canvasElement.width = this.videoElement.videoWidth;
        this.canvasElement.height = this.videoElement.videoHeight;
      }
    }, 2000);
  }
  public videoTimeUpdate() {
    let lenVTD = this.thumbList.length;
    lenVTD = lenVTD + 1;
    if (this.curTime && lenVTD <= this.noofThumb) {
      this.ctx.drawImage(this.videoElement, 0, 0, this.videoElement.videoWidth, this.videoElement.videoHeight);
      const thubmTT = this.canvasElement.toDataURL();
      this.thumbList.push(thubmTT);
    }
  }
  /* Change and Upload Image in User Module */
  public async changeImage(event: any) {
    const img = event.target;
    if (img.files[0] !== undefined) {
      const imgSize = this.CONSTANT.imageUpload.MAX_FILE_SIZE;
      let temp;
      const fileTypes = this.CONSTANT.imageUpload.ALLOW_FILE_TYPE;
      if (fileTypes.includes(img.files[0].type) === false) {
        const message = await this.getTranslation(this.CONSTANT.imageUpload.MESSAGE, this.CONSTANT.imageUpload.FILE);
        this.toastr.error(message);
      } else {
        if ((temp = imgSize) === void 0 || temp === '' || img.files[0].size / 1024 / 1024 < imgSize) {
          const reader = new FileReader();
          reader.onload = (ev: any) => {
            this.customThumbVal = ev.target.result;
            this.showThumb = true;
          };
          reader.readAsDataURL(img.files[0]);
        } else {
          const message = await this.getTranslation('PLEASE_UPLOAD_IMAGE_MAXSIZE', imgSize);
          this.toastr.error(message);
        }
      }
    }
  }
  // convert base64 to file
  private dataURLtoFile(dataurl, filename) {
    if (dataurl) {
      const arr = dataurl.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    } else {
      return '';
    }
  }
  /**
   * Save video
   * @param frm for validate form data
   */
  public onSaveVideo(frm: NgForm) {
    if (frm.invalid) {
      return;
    }
    /* FormData for pushing the code with Image URL */
    const formData: FormData = new FormData();
    formData.append('video_name', this.videoName);
    formData.append('thumbnail', frm.value.video_thumb ? this.dataURLtoFile(frm.value.video_thumb, 'thumb.png') : '');
    formData.append('duration', this.videoDuration.toString());
  }
}

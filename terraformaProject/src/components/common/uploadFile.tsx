import { toast } from 'react-toastify'

import { t } from 'i18next'

const uploadFile = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch(
        process.env.REACT_APP_API_IMAGE_URL as string,
        {
          method: 'POST',
          body: formData,
        }
      )
      if (response.ok) {
        const data = await response.json()
        return data.data.url
      } else {
        toast.error(t('Failed to upload file'))
        return ''
      }
    } catch (error) {
      toast.error(t('Failed to upload file'))
      return ''
    }
  }
  export default uploadFile
// Use this utils when download file without API
// Need to enabled CORS from server side

import { isEmpty } from './common';
export const DownloadFile = (
  filename: string,
  link: string,
  successCallBack?: () => void,
  errorHandler?: (data: any) => void,
  downloadWithOriginalName = false
) => {
  if (isEmpty(link)) {
    if (errorHandler) {
      errorHandler(null);
    }
    return;
  }
  const timeStemp = +new Date();
  const params = { t: timeStemp };
  const reqURL = new URL(link);
  Object.keys(params).forEach((k) => {
    reqURL.searchParams.append(k, params[k]);
  });
  fetch(reqURL.toString(), {
    method: 'GET',
  })
    .then((response) => {
      if (response.status === 200) {
        return response.blob();
      } else {
        return Promise.reject();
      }
    })
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const anchorEle = document.createElement('a');
      anchorEle.href = url;
      if (!downloadWithOriginalName) {
        anchorEle.download = filename;
      } else {
        anchorEle.download = getFileNameFromURL(link);
      }
      document.body.appendChild(anchorEle); // we need to append the element to the dom -> otherwise it will not work in firefox
      anchorEle.click();
      anchorEle.remove(); // afterwards we remove the element again
      if (successCallBack) {
        successCallBack();
      }
    })
    .catch((er) => {
      if (errorHandler) {
        errorHandler(er);
      }
    });
};
const getFileNameFromURL = (url) => {
  if (isEmpty(url)) {
    return '';
  }
  return url.replace(/^.*[\\\/]/, '');
};
export default DownloadFile;

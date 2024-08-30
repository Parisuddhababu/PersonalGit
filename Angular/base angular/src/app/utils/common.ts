import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { CONFIG } from '../config/app-config';

export const isEmpty = (value) => {
  return _.isEmpty(value) ? (_.isNumber(value) || _.isBoolean(value) ? false : true) : false;
};

export const errorHandler = async (toastr: ToastrService, translate: TranslateService, error, callBack?: CallableFunction) => {
  const errorData = error;
  if (errorData && errorData.meta) {
    if (errorData.meta.message_code === 'VALIDATION_ERROR') {
      for (const key in errorData.errors) {
        if (key) {
          toastr.error(errorData.errors[key][0]);
        }
      }
    } else {
      toastr.error(errorData.meta.message);
    }
  } else {
    const message = await translate.get('SOMETHING_WENT_WRONG').toPromise();
    toastr.error(message);
  }

  if (callBack) {
    callBack();
  }
};

export const successHandler = (toastr: ToastrService, data, callBack?: CallableFunction, showToastr = true) => {
  const msg = _.get(data, 'meta.message', '');
  if (showToastr === true && !isEmpty(msg)) {
    toastr.success(msg);
  }
  if (callBack) {
    callBack(data);
  }
};

export const downloadSuccessHandler = async (http: HttpClient, toastr: ToastrService, translate: TranslateService,
  data, callBack?: CallableFunction, type?: ExportFileType, filePathKey: string = 'file', preserve = false) => {
  const file = _.get(data, `data.${filePathKey}`, null);
  if (file) {
    // const appendTxt = preserve === true ? '&preserve=true' : '';
    // window.open(CONFIG.fileDownloadURL + '?file=' + fileUrl + appendTxt, '_self');
    http
      .post(CONFIG.fileDownloadURL, {
        file,
        is_delete: preserve === true ? 0 : 1,
        file_type: type
      }, {
        responseType: 'blob',
      })
      .toPromise()
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const anchorEle = document.createElement('a');
        anchorEle.href = url;
        anchorEle.download = getFileNameFromURL(file);
        document.body.appendChild(anchorEle); // we need to append the element to the dom -> otherwise it will not work in firefox
        anchorEle.click();
        anchorEle.remove(); // afterwards we remove the element again
        if (callBack) {
          callBack();
        }
      })
      .catch((er) => {
        if (errorHandler) {
          callBack(er);
        }
      });
  } else {
    const message = await translate.get('NO_DATA_AVAILABLE').toPromise();
    toastr.error(message);
  }
  if (callBack) {
    callBack(data);
  }
};

export enum FileType {
  EXCEL = 'excel',
  PDF = 'pdf',
  CSV = 'csv'
}

export const getValueByKey = (obj, key, defaultVal: any = '') => {
  return _.get(obj, key, defaultVal);
};


export enum ExportFileType {
  SAMPLE = "sample",
  USER = "user",
  SUGGESTION = "suggestion",
  OFFER = "offer"
}

const getFileNameFromURL = (url) => {
  if (isEmpty(url)) return '';
  return url.replace(/^.*[\\\/]/, '');
};

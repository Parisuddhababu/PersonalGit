import { KeyValue } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { CONFIGCONSTANTS } from '../config/app-constants';
import { statusList, StatusValue } from '../utils/enum-const';
import { getStatusClass } from '../utils/status';
import { CommonRegx } from '../_validators/common.validator';
import { downloadSuccessHandler, errorHandler, FileType, getValueByKey, isEmpty, successHandler } from './../utils/common';
import { DownloadFile } from './../utils/download';
import { BaseServiceInjector } from './base.injector';

@Component({
  selector: 'app-base-component',
  template: ``,
})
export class BaseComponent extends BaseServiceInjector {
  dataTableIndexColumnWidth = CONFIGCONSTANTS.dataTableIndexColumnWidth;
  public CONSTANT = CONFIGCONSTANTS;
  public dateFormat = CONFIGCONSTANTS.dateFormat;
  public dateShortFormat = CONFIGCONSTANTS.dateShortFormat;
  public dateRangeConfig = CONFIGCONSTANTS.dateRangeConfig;
  public momentDateFormat = CONFIGCONSTANTS.momentDateFormat;
  public momentDateTime24Format = CONFIGCONSTANTS.momentDateTime24Format;
  public noData = '-';
  public CommonRegx = CommonRegx;

  public FileType = FileType;

  public modalRef: BsModalRef;
  public noImage = 'assets/no-image.png';
  public noProfileImage = 'assets/default-user-image.png';
  protected errorHandler = errorHandler;
  protected successHandler = successHandler;
  protected downloadSuccessHandler = downloadSuccessHandler;
  public getStatusClass = getStatusClass;
  public getValueByKey = getValueByKey;
  public isEmpty = isEmpty;
  public statusEnum = StatusValue;
  public statusList = statusList;
  //#region Datatable configuration
  @ViewChild(DatatableComponent) datatable: DatatableComponent;
  public loadingIndicator = false;
  ColumnMode = ColumnMode;
  reorderable = CONFIGCONSTANTS.datatableConfig.reorderable;
  scrollbarH = CONFIGCONSTANTS.datatableConfig.scrollbarH;
  serverSorting = CONFIGCONSTANTS.datatableConfig.serverSorting;
  serverPaging = CONFIGCONSTANTS.datatableConfig.serverPaging;
  piningRight = CONFIGCONSTANTS.datatableConfig.piningRight;
  headerHeight = CONFIGCONSTANTS.datatableConfig.headerHeight;
  footerHeight = CONFIGCONSTANTS.datatableConfig.footerHeight;
  rowHeight = CONFIGCONSTANTS.datatableConfig.rowHeight;
  limitList: any[] = CONFIGCONSTANTS.datatableConfig.limitList;
  totalReords = CONFIGCONSTANTS.datatableConfig.page.totalReords;
  pageNumber = CONFIGCONSTANTS.datatableConfig.page.pageNumber;
  size = CONFIGCONSTANTS.datatableConfig.page.size;
  dtMessages = {
    ...CONFIGCONSTANTS.datatableConfig.dtMessages
  };
  sortParam = 'created_at';
  sortOrder = 'desc';
  //#endregion
  languages = [];
  protected lan = ['en'];
  public languageSubscription: Subscription;
  constructor() {
    super();
    this.languages = this.multilingualService.getLanguage();
    this.initDataTableMessages();
    this.languageSubscription = this.translateService.onLangChange.subscribe((d) => {
      this.initDataTableMessages();
    });
  }

  public initDataTableMessages() {
    Object.keys(CONFIGCONSTANTS.datatableConfig.dtMessages).forEach(async (k) => {
      this.dtMessages[k] = await this.translateService.get(CONFIGCONSTANTS.datatableConfig.dtMessages[k]).toPromise();
    });
  }

  public onErrorImage(event: any) {
    event.target.src = this.noImage;
  }

  public onErrorProfileImage(event: any) {
    event.target.src = this.noProfileImage;
  }

  public DownloadFileByURL(
    name: string,
    link: string,
    successCallBack?: () => void,
    errorCallBack?: () => void,
    downloadWithOriginalName = false
  ) {
    const filename = name || this.getFileName(link);
    this.loader.showLoader();
    DownloadFile(
      filename,
      link,
      () => {
        this.loader.hideLoader();
        if (successCallBack) {
          successCallBack();
        }
      },
      async (err) => {
        this.loader.hideLoader();
        const msg = await this.translateService.get('DOCUMENT_NOT_FOUND_MSG').toPromise();
        this.toastr.error(msg);
        if (errorCallBack) {
          errorCallBack();
        }
      },
      downloadWithOriginalName
    );
  }

  private getFileName(url: string) {
    if (!url) {
      return '';
    }
    return url.split('/').pop();
  }

  public async getTranslation(key, params = null) {
    const resp = await this.translateService.get(key, { 1: params }).toPromise();
    return resp;
  }

  public formatDate(date: string, format = CONFIGCONSTANTS.ApiRequestFormat) {
    return moment(date).format(format);
  }

  /**
   * Sort status by value
   * @param a Active key value object
   * @param b Inaction key value object
   * @returns
   */
  public orderbyValueAsc = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return a.value > b.value ? 1 : a.value > b.value ? 0 : -1;
  };
}

import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { first } from 'rxjs/operators';
import { ExportFileType } from '../../../utils/common';
import { BaseComponent } from '../../../_components/base.component';
import { ManageOfferService } from '../../../_services/manage-offer.service';
import { OfferReportListComponent } from './offer-report-list.component';

@Component({
  selector: 'app-manage-offer-list',
  templateUrl: './manage-offer-list.component.html',
  styleUrls: ['./manage-offer-list.component.scss'],
})
export class ManageOfferListComponent extends BaseComponent implements OnInit {
  manageOfferList: any = [];

  submitted = false;
  status = '';
  name = '';
  filter: any = this.defaultFilterData;
  offer_type = {
    '0': 'Percentage',
    '1': 'Amount',
  };
  offer_usage = {
    '0': 'Multiple Time',
    '1': 'One Time',
  };
  private offerId: number;
  private changeStatusType: string;
  private changedStatus: string;
  constructor(private manageOfferService: ManageOfferService,
    private http: HttpClient) {
    super();
  }

  ngOnInit() {
    this.filter = this.filterService.getState('offerFilter', this.filter);
    if (this.filter.select_date) {
      this.filter.select_date = [new Date(this.filter.select_date[0]), new Date(this.filter.select_date[1])];
    }
    this.sortParam = this.filterService.getSingleState('offerSortParam', this.sortParam);
    this.sortOrder = this.filterService.getSingleState('offerSortOrder', this.sortOrder);
    this.pageNumber = this.filterService.getSingleState('offerPageNo', this.pageNumber);
    this.size = this.filterService.getSingleState('offerSize', this.size);
    this.getAllManageOfferList();
  }
  /**
   * Sort datatable fields
   * @param event event was triggered, start sort sequence
   */
  public onSort(event) {
    this.sortParam = event.sorts[0].prop;
    this.sortOrder = event.sorts[0].dir;
    this.rerender(false);
  }

  /**
   * Populate the table with new data based on the page number
   * @param page The page to select
   */
  public setPage(pageInfo) {
    this.pageNumber = pageInfo.offset;
    this.rerender(false);
  }
  /**
   * Show number of records in datatable
   * @param value show total entries value 10,25,50,100
   */
  public changeLimit(value) {
    this.size = value;
    this.rerender(true);
  }
  private get filterData() {
    return {
      name: this.filter.name,
      sort_param: this.sortParam,
      sort_type: this.sortOrder,
      status: this.filter.status,
      start_dt: this.filter.select_date ? this.formatDate(this.filter.select_date['0']) : '',
      end_dt: this.filter.select_date ? this.formatDate(this.filter.select_date['1']) : '',
    };
  }
  /**
   * Get Offer list data
   */
  private getAllManageOfferList() {
    // For save filter, sorting, pagenumber and size in storage
    this.filterService.saveState('offerFilter', this.filter);
    this.filterService.saveSingleState('offerSortParam', this.sortParam);
    this.filterService.saveSingleState('offerSortOrder', this.sortOrder);
    this.filterService.saveSingleState('offerPageNo', this.pageNumber);
    this.filterService.saveSingleState('offerSize', this.size);
    this.loadingIndicator = true;
    this.manageOfferService
      .getAllManageOfferList({
        ...this.filterData,
        length: this.size,
        start: this.pageNumber * this.size,
        page_no: this.pageNumber + 1,
      })
      .pipe(first())
      .subscribe(
        (resp) => {
          this.loadingIndicator = false;
          this.manageOfferList = resp.data['original'].data;
          this.totalReords = resp.data['original'].recordsTotal;
        },
        (error) => {
          this.loadingIndicator = false;
        }
      );
  }

  /* Open any Modal Popup */
  openModal(template: TemplateRef<any>, id, status) {
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
    this.offerId = id;
    this.changeStatusType = status;
  }

  decline(): void {
    this.modalRef.hide();
    this.submitted = false;
  }
  /**
   * Change Offer status Active or Inactive
   */
  public changeStatus() {
    this.changedStatus = this.changeStatusType === this.statusEnum.active ? this.statusEnum.inactive : this.statusEnum.active;
    this.loader.showLoader();
    this.manageOfferService
      .changeManageOfferStatus(this.changedStatus, this.offerId)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status === true) {
            this.modalRef.hide();
            this.toastr.success(data.meta.message);
            this.rerender(false);
          }
        },
        (error) => {
          this.errorHandler(this.toastr, this.translateService, error, () => {
            this.loader.hideLoader();
          });
        }
      );
  }
  /**
   * Delete Offer
   */
  public deleteOffer() {
    this.loader.showLoader();
    this.manageOfferService
      .deleteManageOffer(this.offerId)
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.meta.status === true) {
            this.loader.hideLoader();
            this.modalRef.hide();
            this.toastr.success(data.meta.message);
            this.rerender(false, true);
          }
        },
        (error) => {
          this.errorHandler(this.toastr, this.translateService, error, () => {
            this.loader.hideLoader();
          });
        }
      );
  }

  public searchApply() {
    this.rerender(true);
  }
  get defaultFilterData() {
    return {
      status: '',
      name: '',
      select_date: '',
    };
  }
  public resetSearch() {
    this.filter = this.defaultFilterData;
    this.rerender(true);
  }
  /**
   * API call and refresh datatable value
   * @param goFirstPage set first page when param value true
   */
  private rerender(goFirstPage, isDelete = false): void {
    if (goFirstPage) {
      this.pageNumber = 0;
    }
    // Pagination is lost and the panel moves back to the 1st page instead of staying on the same page when delete record
    if (isDelete && this.pageNumber && this.manageOfferList.length === 1) {
      this.pageNumber = this.pageNumber - 1;
    }
    this.getAllManageOfferList();
  }

  /**
   * Offer Data Download
   * @param type
   */
  downloadData(type) {
    this.loader.showLoader();
    this.manageOfferService.getExportOfferList(this.filterData, type).subscribe(
      (data) => {
        this.downloadSuccessHandler(this.http, this.toastr, this.translateService, data, () => {
          this.loader.hideLoader();
        }, ExportFileType.OFFER);
      },
      (error) => {
        this.errorHandler(this.toastr, this.translateService, error, () => {
          this.loader.hideLoader();
        });
      },
      () => this.logger.log('OK')
    );
  }
  /* Open any Modal Popup */
  openModalReport(uuid, id, name) {
    const initialState = {
      offerUuid: uuid,
      offerId: id,
      offerName: name,
    };
    this.modalRef = this.modalService.show(OfferReportListComponent, {
      class: 'modal-lg',
      initialState,
    });
  }
}

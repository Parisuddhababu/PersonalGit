import { Component, OnInit, TemplateRef } from '@angular/core';
import { first } from 'rxjs/operators';
import { BaseComponent } from '../../../_components/base.component';
import { ViewImageModalComponent } from '../../../_modal/view-image.component';
import { ManageBannerService } from '../../../_services/manage-banner.service';

@Component({
  selector: 'app-manage-banner-list',
  templateUrl: './manage-banner-list.component.html',
  styleUrls: ['./manage-banner-list.component.scss'],
})
export class ManageBannerListComponent extends BaseComponent implements OnInit {
  manageBannerList = [];

  filter = this.defaultFilterData;
  private bannerID: number;
  private changeStatusType: string;
  private changedStatus: string;
  submitted = false;

  constructor(private manageBannerService: ManageBannerService) {
    super();
  }

  ngOnInit() {
    this.filter = this.filterService.getState('bannerFilter', this.filter);
    this.sortParam = this.filterService.getSingleState('bannerSortParam', this.sortParam);
    this.sortOrder = this.filterService.getSingleState('bannerSortOrder', this.sortOrder);
    this.pageNumber = this.filterService.getSingleState('bannerPageNo', this.pageNumber);
    this.size = this.filterService.getSingleState('bannerSize', this.size);
    this.getAllBannerList();
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

  /**
   * get All Banner List
   */
  private getAllBannerList() {
    // For save filter, sorting, pagenumber and size in storage
    this.filterService.saveState('bannerFilter', this.filter);
    this.filterService.saveSingleState('bannerSortParam', this.sortParam);
    this.filterService.saveSingleState('bannerSortOrder', this.sortOrder);
    this.filterService.saveSingleState('bannerPageNo', this.pageNumber);
    this.filterService.saveSingleState('bannerSize', this.size);
    this.loadingIndicator = true;
    this.manageBannerService
      .getAllBannerList({
        banner_title: this.filter.banner_title,
        created_by: this.filter.created_by,
        status: this.filter.status,
        length: this.size,
        page_no: this.pageNumber + 1,
        sort_param: this.sortParam,
        sort_type: this.sortOrder,
      })
      .pipe(first())
      .subscribe(
        (resp) => {
          this.loadingIndicator = false;
          this.manageBannerList = resp.data['original'].data;
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
    this.bannerID = id;
    this.changeStatusType = status;
  }

  decline(): void {
    this.modalRef.hide();
    this.submitted = false;
  }

  /**
   * Change banner status Active or Inactive
   */
  public changeStatus() {
    this.loader.showLoader();
    this.changedStatus = this.changeStatusType === this.statusEnum.active ? this.statusEnum.inactive : this.statusEnum.active;
    this.manageBannerService
      .changeManageBannerStatus(this.changedStatus, this.bannerID)
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
   * Delete Banner
   */
  public deleteManageBanner() {
    this.loader.showLoader();
    this.manageBannerService
      .deleteManageBanner(this.bannerID)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status === true) {
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
      banner_title: '',
      created_by: '',
      status: '',
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
    if (isDelete && this.pageNumber && this.manageBannerList.length === 1) {
      this.pageNumber = this.pageNumber - 1;
    }
    this.getAllBannerList();
  }

  openModalForImage(img) {
    const initialState = {
      image: img,
    };
    this.modalRef = this.modalService.show(ViewImageModalComponent, {
      class: 'modal-lg',
      initialState,
    });
  }
}

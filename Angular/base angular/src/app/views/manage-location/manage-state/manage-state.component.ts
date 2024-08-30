import { Component, OnInit, TemplateRef } from '@angular/core';
import { first } from 'rxjs/operators';
import { BaseComponent } from '../../../_components/base.component';
import { LocationService } from '../../../_services/location.service';

@Component({
  selector: 'app-manage-state',
  templateUrl: './manage-state.component.html',
  styleUrls: ['./manage-state.component.scss'],
})
export class ManageStateComponent extends BaseComponent implements OnInit {
  countryList = [];
  stateList = [];
  filter = this.defaultFilterData;
  modalID: number;
  changeStatusType: string;
  changedStatus: string;
  constructor(private locationService: LocationService) {
    super();
  }

  ngOnInit() {
    this.filter = this.filterService.getState('stateFilter', this.filter);
    this.sortParam = this.filterService.getSingleState('stateSortParam', this.sortParam);
    this.sortOrder = this.filterService.getSingleState('stateSortOrder', this.sortOrder);
    this.pageNumber = this.filterService.getSingleState('statePageNo', this.pageNumber);
    this.size = this.filterService.getSingleState('stateSize', this.size);
    this.getCountryList();
    this.getStateList();
  }
  getCountryList() {
    this.locationService
      .getActiveCountry()
      .pipe(first())
      .subscribe(
        (response) => {
          this.countryList = response.data;
        },
        (error) => {
          this.logger.error(error);
        }
      );
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
  private getStateList() {
    // For save filter, sorting, pagenumber and size in storage
    this.filterService.saveState('stateFilter', this.filter);
    this.filterService.saveSingleState('stateSortParam', this.sortParam);
    this.filterService.saveSingleState('stateSortOrder', this.sortOrder);
    this.filterService.saveSingleState('statePageNo', this.pageNumber);
    this.filterService.saveSingleState('stateSize', this.size);
    this.loadingIndicator = true;
    this.locationService
      .getAllStateList({
        country_name: this.filter.countryname,
        name: this.filter.statename,
        state_code: this.filter.statecode,
        status: this.filter.status,
        start: this.pageNumber * this.size,
        length: this.size,
        sort_param: this.sortParam,
        sort_type: this.sortOrder,
      })
      .pipe(first())
      .subscribe(
        (resp) => {
          this.loadingIndicator = false;
          this.stateList = resp.data['original'].data;
          this.totalReords = resp.data['original'].recordsTotal;
        },
        (err) => {
          this.loadingIndicator = false;
        }
      );
  }

  openModal(template: TemplateRef<any>, id, status) {
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
    this.modalID = id;
    this.changeStatusType = status;
  }

  decline(): void {
    this.modalRef.hide();
  }
  /**
   * Change Sub Admin status Active or Inactive
   */
  public changeStatus() {
    this.changedStatus = this.changeStatusType === this.statusEnum.active ? this.statusEnum.inactive : this.statusEnum.active;
    this.loader.showLoader();
    this.locationService
      .changeStateStatus(this.changedStatus, this.modalID)
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
   * Delete Country
   */
  public deleteState() {
    this.loader.showLoader();
    this.locationService
      .deleteState(this.modalID)
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
      countryname: '',
      statename: '',
      statecode: '',
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
  rerender(goFirstPage, isDelete = false): void {
    if (goFirstPage) {
      this.pageNumber = 0;
    }
    // Pagination is lost and the panel moves back to the 1st page instead of staying on the same page when delete record
    if (isDelete && this.pageNumber && this.stateList.length === 1) {
      this.pageNumber = this.pageNumber - 1;
    }
    this.getStateList();
  }
}

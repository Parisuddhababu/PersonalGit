import { Component, OnInit, TemplateRef } from '@angular/core';
import { first } from 'rxjs/operators';
import { subscriptionPlanType, subscriptionValidity } from '../../../utils/enum-const';
import { BaseComponent } from '../../../_components/base.component';
import { ManageSubscriptionService } from '../../../_services/manage-subscription.service';

@Component({
  selector: 'app-subscription-list',
  templateUrl: './subscription-list.component.html',
  styleUrls: ['./subscription-list.component.scss'],
})
export class SubscriptionListComponent extends BaseComponent implements OnInit {
  manageSubscriptionList = [];

  submitted = false;
  filter: any = this.defaultFilterData;

  plan_validity = subscriptionValidity;
  plan_type = subscriptionPlanType;

  private subscriptionID: number;
  private changeStatusType: string;
  private changedStatus: string;
  // roleList: any;

  constructor(private manageSubscriptionService: ManageSubscriptionService) {
    super();
  }

  ngOnInit() {
    this.filter = this.filterService.getState('subscriptionFilter', this.filter);
    if (this.filter.select_date) {
      this.filter.select_date = [new Date(this.filter.select_date[0]), new Date(this.filter.select_date[1])];
    }
    this.sortParam = this.filterService.getSingleState('subscriptionSortParam', this.sortParam);
    this.sortOrder = this.filterService.getSingleState('subscriptionSortOrder', this.sortOrder);
    this.pageNumber = this.filterService.getSingleState('subscriptionPageNo', this.pageNumber);
    this.size = this.filterService.getSingleState('subscriptionSize', this.size);
    this.getAllManageSubscriptionList();
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
   * Get subscription list data
   */
  private getAllManageSubscriptionList() {
    // For save filter, sorting, pagenumber and size in storage
    this.filterService.saveState('subscriptionFilter', this.filter);
    this.filterService.saveSingleState('subscriptionSortParam', this.sortParam);
    this.filterService.saveSingleState('subscriptionSortOrder', this.sortOrder);
    this.filterService.saveSingleState('subscriptionPageNo', this.pageNumber);
    this.filterService.saveSingleState('subscriptionSize', this.size);
    this.loadingIndicator = true;
    this.manageSubscriptionService
      .getAllManageSubscriptionList({
        name: this.filter.name,
        validity: this.filter.validity,
        price: this.filter.price,
        start_date: this.filter.select_date ? this.formatDate(this.filter.select_date['0']) : '',
        end_date: this.filter.select_date ? this.formatDate(this.filter.select_date['1']) : '',
        sort_param: this.sortParam,
        sort_type: this.sortOrder,
        length: this.size,
        page_no: this.pageNumber + 1,
        is_trial_plan: this.filter.is_trial_plan,
      })
      .pipe(first())
      .subscribe(
        (resp) => {
          this.loadingIndicator = false;
          this.manageSubscriptionList = resp.data['original'].data;
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
    this.subscriptionID = id;
    this.changeStatusType = status;
  }

  decline(): void {
    this.modalRef.hide();
    this.submitted = false;
  }
  /**
   * Change subscription status Active or Inactive
   */
  public changeStatus() {
    this.loader.showLoader();
    this.changedStatus = this.changeStatusType === this.statusEnum.active ? this.statusEnum.inactive : this.statusEnum.active;
    this.manageSubscriptionService
      .changeManageSubscriptionStatus(this.changedStatus, this.subscriptionID)
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
   * Delete Subscription
   */
  public deleteManageSubscription() {
    this.loader.showLoader();
    this.manageSubscriptionService
      .deleteManageSubscription(this.subscriptionID)
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
      name: '',
      validity: '',
      price: '',
      select_date: '',
      is_trial_plan: '',
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
    if (isDelete && this.pageNumber && this.manageSubscriptionList.length === 1) {
      this.pageNumber = this.pageNumber - 1;
    }
    this.getAllManageSubscriptionList();
  }
}

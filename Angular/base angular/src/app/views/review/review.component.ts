import { Component, OnInit, TemplateRef } from '@angular/core';
import { first } from 'rxjs/operators';
import { BaseComponent } from '../../_components/base.component';
import { DescriptionModalComponent } from '../../_modal/description.component';
import { ReviewService } from '../../_services/review.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
})
export class ReviewComponent extends BaseComponent implements OnInit {
  reviewList = [];
  name = '';
  private reviewID: number;
  private changeStatusType: string;
  private changedStatus: string;
  constructor(private reviewService: ReviewService) {
    super();
  }

  ngOnInit() {
    this.name = this.filterService.getSingleState('reviewFilter', this.name);
    this.sortParam = this.filterService.getSingleState('reviewSortParam', this.sortParam);
    this.sortOrder = this.filterService.getSingleState('reviewSortOrder', this.sortOrder);
    this.pageNumber = this.filterService.getSingleState('reviewPageNo', this.pageNumber);
    this.size = this.filterService.getSingleState('reviewSize', this.size);
    this.getReviewList();
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
   * Get Sub Admin list data
   */
  private getReviewList() {
    // For save filter, sorting, pagenumber and size in storage
    this.filterService.saveSingleState('reviewFilter', this.name);
    this.filterService.saveSingleState('reviewSortParam', this.sortParam);
    this.filterService.saveSingleState('reviewSortOrder', this.sortOrder);
    this.filterService.saveSingleState('reviewPageNo', this.pageNumber);
    this.filterService.saveSingleState('reviewSize', this.size);
    this.loadingIndicator = true;
    this.reviewService
      .getReviewList({
        search_keyword: this.name,
        start: this.pageNumber * this.size,
        length: this.size,
        sort_param: this.sortParam,
        sort_type: this.sortOrder,
      })
      .pipe(first())
      .subscribe(
        (resp) => {
          this.loadingIndicator = false;
          this.reviewList = resp.data['original'].data;
          this.totalReords = resp.data['original'].recordsTotal;
        },
        (err) => {
          this.loadingIndicator = false;
        }
      );
  }
  public searchApply() {
    this.rerender(true);
  }

  public resetSearch() {
    this.name = '';
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
    if (isDelete && this.pageNumber && this.reviewList.length === 1) {
      this.pageNumber = this.pageNumber - 1;
    }
    this.getReviewList();
  }
  openModal(template: TemplateRef<any>, id, status) {
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
    this.reviewID = id;
    this.changeStatusType = status;
  }

  decline(): void {
    this.modalRef.hide();
  }
  public deleteReview() {
    this.loader.showLoader();
    this.reviewService
      .deleteReview(this.reviewID)
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
  /**
   * Change status Active or Inactive
   */
  public changeStatus() {
    this.loader.showLoader();
    this.changedStatus = this.changeStatusType === this.statusEnum.active ? this.statusEnum.inactive : this.statusEnum.active;
    this.reviewService
      .changeReviewStatus(this.changedStatus, this.reviewID)
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
  openDescriptionModal(msg) {
    const initialState = {
      modalTitle: 'REVIEW',
      description: msg,
    };
    this.modalRef = this.modalService.show(DescriptionModalComponent, {
      class: 'modal-lg',
      backdrop: 'static',
      initialState,
    });
  }
}

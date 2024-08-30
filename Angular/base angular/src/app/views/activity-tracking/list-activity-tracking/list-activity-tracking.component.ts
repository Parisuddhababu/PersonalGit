import { Component, OnInit, TemplateRef } from '@angular/core';
import * as moment from 'moment';
import { first } from 'rxjs/operators';
import { BaseComponent } from '../../../_components/base.component';
import { ActivityTrackingService } from '../../../_services/activity-tracking.service';

@Component({
  selector: 'app-list-activity-tracking',
  templateUrl: './list-activity-tracking.component.html',
  styleUrls: ['./list-activity-tracking.component.scss'],
})
export class ListActivityTrackingComponent extends BaseComponent implements OnInit {
  activityList = [];
  filter: any = this.defaultFilterData;
  from_date = '';
  to_date = '';
  activityId: number;
  maxDate: any;

  constructor(private activityTrackingService: ActivityTrackingService) {
    super();
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate());
  }

  ngOnInit() {
    this.filter = this.filterService.getState('activityFilter', this.filter);
    if (this.filter.select_date) {
      this.filter.select_date = [new Date(this.filter.select_date[0]), new Date(this.filter.select_date[1])];
    }
    this.sortParam = this.filterService.getSingleState('activitySortParam', this.sortParam);
    this.sortOrder = this.filterService.getSingleState('activitySortOrder', this.sortOrder);
    this.pageNumber = this.filterService.getSingleState('activityPageNo', this.pageNumber);
    this.size = this.filterService.getSingleState('activitySize', this.size);
    this.getAllActivityTrackingList();
  }
  get defaultFilterData() {
    return {
      name: '',
      email: '',
      activity_desc: '',
      select_date: '',
    };
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
   * API call and refresh datatable value
   * @param goFirstPage set first page when param value true
   */
  private rerender(goFirstPage, isDelete = false): void {
    if (goFirstPage) {
      this.pageNumber = 0;
    }
    // Pagination is lost and the panel moves back to the 1st page instead of staying on the same page when delete record
    if (isDelete && this.pageNumber && this.activityList.length === 1) {
      this.pageNumber = this.pageNumber - 1;
    }
    this.getAllActivityTrackingList();
  }

  private getAllActivityTrackingList() {
    // For save filter, sorting, pagenumber and size in storage
    this.filterService.saveState('activityFilter', this.filter);
    this.filterService.saveSingleState('activitySortParam', this.sortParam);
    this.filterService.saveSingleState('activitySortOrder', this.sortOrder);
    this.filterService.saveSingleState('activityPageNo', this.pageNumber);
    this.filterService.saveSingleState('activitySize', this.size);
    this.loadingIndicator = true;
    this.activityTrackingService
      .getAllActivityTrackingList({
        name: this.filter.name,
        email: this.filter.email,
        activity_desc: this.filter.activity_desc,
        from_date: this.filter.select_date ? moment(this.filter.select_date['0']).format(this.momentDateFormat) : '',
        to_date: this.filter.select_date ? moment(this.filter.select_date['1']).format(this.momentDateFormat) : '',
        length: this.size,
        start: this.pageNumber * this.size,
        sort_param: this.sortParam,
        sort_type: this.sortOrder,
      })
      .pipe(first())
      .subscribe(
        (resp) => {
          this.loadingIndicator = false;
          this.activityList = resp.data['original'].data;
          this.totalReords = resp.data['original'].recordsTotal;
        },
        (error) => {
          this.loadingIndicator = false;
        }
      );
  }

  public searchApply() {
    this.rerender(true);
  }

  public resetSearch() {
    this.filter = this.defaultFilterData;
    this.rerender(true);
  }

  /* Open any Modal Popup */
  openModal(template: TemplateRef<any>, id) {
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
    this.activityId = id;
  }

  decline(): void {
    this.modalRef.hide();
  }

  /**
   * Delete Activity Log
   */
  public deleteActivityLog() {
    this.activityTrackingService
      .deleteActivity(this.activityId)
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.meta.status === true) {
            this.modalRef.hide();
            this.toastr.success(data.meta.message);
            this.rerender(false, true);
          }
        },
        (error) => {
          this.errorHandler(this.toastr, this.translateService, error);
        }
      );
  }
}

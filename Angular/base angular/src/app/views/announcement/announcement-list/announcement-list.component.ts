import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { announcementPlatforms, announcementStatus, announcementType } from '../../../utils/enum-const';
import { BaseComponent } from '../../../_components/base.component';
import { AnnouncementService } from '../../../_services/announcement.service';

@Component({
  selector: 'app-announcement-list',
  templateUrl: './announcement-list.component.html',
  styleUrls: ['./announcement-list.component.scss'],
})
export class AnnouncementListComponent extends BaseComponent implements OnInit {
  ManageAnnouncementList = [];

  constructor(private announcementService: AnnouncementService) {
    super();
  }
  data: any[];
  types = announcementType;
  platforms = announcementPlatforms;
  status = announcementStatus;
  filter: any = this.defaultFilterData;

  ngOnInit() {
    this.filter = this.filterService.getState('announceFilter', this.filter);
    if (this.filter.select_date) {
      this.filter.select_date = [new Date(this.filter.select_date[0]), new Date(this.filter.select_date[1])];
    }
    this.sortParam = this.filterService.getSingleState('announceSortParam', this.sortParam);
    this.sortOrder = this.filterService.getSingleState('announceSortOrder', this.sortOrder);
    this.pageNumber = this.filterService.getSingleState('announcePageNo', this.pageNumber);
    this.size = this.filterService.getSingleState('announceSize', this.size);
    this.data = [];
    this.getAllAnnouncementListURL();
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
   * Get All Announcement List
   */
  private getAllAnnouncementListURL() {
    // For save filter, sorting, pagenumber and size in storage
    this.filterService.saveState('announceFilter', this.filter);
    this.filterService.saveSingleState('announceSortParam', this.sortParam);
    this.filterService.saveSingleState('announceSortOrder', this.sortOrder);
    this.filterService.saveSingleState('announcePageNo', this.pageNumber);
    this.filterService.saveSingleState('announceSize', this.size);
    this.loadingIndicator = true;
    this.announcementService
      .getAllAnnouncementList({
        query: this.filter.keyword,
        start_date: this.filter.select_date ? this.formatDate(this.filter.select_date[0]) : '',
        end_date: this.filter.select_date ? this.formatDate(this.filter.select_date[1]) : '',
        type: this.filter.type,
        user_type: this.filter.user_type,
        status: this.filter.status,
        start: this.pageNumber * this.size,
        length: this.size,
        sort_field: this.sortParam,
        sort_field_value: this.sortOrder,
      })
      .pipe(first())
      .subscribe(
        (resp) => {
          this.loadingIndicator = false;
          this.ManageAnnouncementList = resp.data['original'].data;
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

  /**
   * API call and refresh datatable value
   * @param goFirstPage set first page when param value true
   */
  private rerender(goFirstPage): void {
    if (goFirstPage) {
      this.pageNumber = 0;
    }
    this.getAllAnnouncementListURL();
  }
  get defaultFilterData() {
    return {
      status: '',
      type: '',
      user_type: '',
      keyword: '',
      select_date: '',
    };
  }
  /**
   * Reset Searching
   */
  public resetSearch() {
    this.filter = this.defaultFilterData;
    this.rerender(true);
  }
}

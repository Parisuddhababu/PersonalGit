import { Component, Input, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { BaseComponent } from '../../../_components/base.component';
import { AnnouncementService } from '../../../_services/announcement.service';

@Component({
  selector: 'app-announcement-receivers',
  templateUrl: './announcement-receivers.component.html',
  styleUrls: ['./announcement-receivers.component.scss'],
})
export class AnnouncementReceiversComponent extends BaseComponent implements OnInit {
  private __announcementUuid = '';
  @Input('announcement-uuid')
  set announcementUuid(announcementUuid: string) {
    this.__announcementUuid = announcementUuid;
    this.rerender();
  }
  get announcementUuid() {
    return this.__announcementUuid;
  }

  userList = [];
  global_search = '';
  private filteredData = [];

  notificationStatus: any = {
    '0': 'In-Progress',
    '1': 'Sent',
    '2': 'Failed',
  };

  constructor(private announcementService: AnnouncementService) {
    super();
  }

  ngOnInit() {
    this.getReceiverDetails();
  }

  /**
   * Get Receiver Details
   */
  public getReceiverDetails() {
    if (this.announcementUuid) {
      this.announcementService
        .getAnnouncementUserData({
          uuid: this.announcementUuid,
        })
        .pipe(first())
        .subscribe(
          (resp) => {
            this.userList = resp.data['original'].data;
            this.filteredData = resp.data['original'].data;
          },
          (error) => {
            this.logger.error(error);
          }
        );
    }
  }
  /**
   * Show number of records in datatable
   * @param value show total entries value 10,25,50,100
   */
  public changeLimit(value) {
    this.size = value;
  }

  /**
   * API call and refresh datatable value
   * @param goFirstPage set first page when param value true
   */
  private rerender(): void {
    this.getReceiverDetails();
  }

  /**
   * Datatabe global search
   * @param event get search input value
   */
  public filterDatatable(event) {
    const val = event.target.value.toLowerCase();
    // get the key names of each column in the dataset
    const keys = ['name', 'email', 'role'];
    // assign filtered matches to the active datatable
    this.userList = this.filteredData.filter(function (item) {
      // iterate through each row's column data
      for (let i = 0; i < keys.length; i++) {
        // check for a match
        if ((item[keys[i]] && item[keys[i]].toString().toLowerCase().indexOf(val) !== -1) || !val) {
          // found match, return true to add to result set
          return true;
        }
      }
    });
    // whenever the filter changes, always go back to the first page
    this.datatable.offset = 0;
  }
}

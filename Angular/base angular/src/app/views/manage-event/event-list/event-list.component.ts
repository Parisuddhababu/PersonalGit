import { Component, OnInit, TemplateRef } from '@angular/core';
import { first } from 'rxjs/operators';
import { CONFIGCONSTANTS } from '../../../config/app-constants';
import { BaseComponent } from '../../../_components/base.component';
import { DescriptionModalComponent } from '../../../_modal/description.component';
import { ManageEventService } from '../../../_services/manage-event.service';
import { SubadminService } from './../../../_services/subadmin-service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
})
export class EventListComponent extends BaseComponent implements OnInit {
  eventList: any = [];
  filter: any = this.defaultFilterData;
  private eventId: number;
  accessToken: string;
  authInstance: gapi.auth2.GoogleAuth;
  error: string;
  user: gapi.auth2.GoogleUser;
  isAuthenticate = false;
  repeated = {
    never: 'Never',
    daily: 'Daily',
  };
  subAdminList: string[];
  constructor(private eventService: ManageEventService, private subadminService: SubadminService) {
    super();
  }

  async ngOnInit() {
    this.filter = this.filterService.getState('eventFilter', this.filter);
    if (this.filter.schedule_date) {
      this.filter.schedule_date = [new Date(this.filter.schedule_date[0]), new Date(this.filter.schedule_date[1])];
    }
    this.sortParam = this.filterService.getSingleState('eventSortParam', this.sortParam);
    this.sortOrder = this.filterService.getSingleState('eventSortOrder', this.sortOrder);
    this.pageNumber = this.filterService.getSingleState('eventPageNo', this.pageNumber);
    this.size = this.filterService.getSingleState('eventSize', this.size);
    this.getAllEventList();
    this.getSubAdminList();
    if (await this.checkIfUserAuthenticated()) {
      this.user = this.authInstance.currentUser.get();
      this.accessToken = this.user.getAuthResponse(true).access_token;
    }
  }
  async initGoogleAuth(): Promise<void> {
    //  Create a new Promise where the resolve
    // function is the callback passed to gapi.load
    const pload = new Promise((resolve) => {
      gapi.load('auth2', resolve);
    });

    // When the first promise resolves, it means we have gapi
    // loaded and that we can call gapi.init
    return pload.then(async () => {
      await gapi.auth2.init({ client_id: CONFIGCONSTANTS.clientId, scope: CONFIGCONSTANTS.calendarScope }).then((auth) => {
        this.isAuthenticate = true;
        this.authInstance = auth;
      });
    });
  }
  async checkIfUserAuthenticated(): Promise<boolean> {
    // Initialize gapi if not done yet
    if (!this.isAuthenticate) {
      await this.initGoogleAuth();
    }

    return this.authInstance.isSignedIn.get();
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
   * Used to fetch sub admin list for created_by filter
   *
   */
  getSubAdminList() {
    this.subadminService
      .getAllSubadminListForDropdown()
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.meta.status === true) {
            this.subAdminList = data.data;
          }
        },
        (error) => {
          this.logger.error(error);
        }
      );
  }

  /**
   * Get Offer list data
   */
  private getAllEventList() {
    // For save filter, sorting, pagenumber and size in storage
    this.filterService.saveState('eventFilter', this.filter);
    this.filterService.saveSingleState('eventSortParam', this.sortParam);
    this.filterService.saveSingleState('eventSortOrder', this.sortOrder);
    this.filterService.saveSingleState('eventPageNo', this.pageNumber);
    this.filterService.saveSingleState('eventSize', this.size);
    this.loadingIndicator = true;
    this.eventService
      .getAllEventList({
        event_name: this.filter.name,
        created_by: this.filter.created_by,
        sort_param: this.sortParam,
        sort_type: this.sortOrder,
        length: this.size,
        // page_no: (this.pageNumber + 1),
        start: this.pageNumber * this.size,
        from_date: this.filter.schedule_date ? this.formatDate(this.filter.schedule_date['0']) : '',
        to_date: this.filter.schedule_date ? this.formatDate(this.filter.schedule_date['1']) : '',
      })
      .pipe(first())
      .subscribe(
        (resp) => {
          this.loadingIndicator = false;
          this.eventList = resp.data['original'].data;
          this.totalReords = resp.data['original'].recordsTotal;
        },
        (error) => {
          this.loadingIndicator = false;
        }
      );
  }

  /* Open any Modal Popup */
  openModal(template: TemplateRef<any>, id) {
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
    this.eventId = id;
  }

  decline(): void {
    this.modalRef.hide();
  }
  /**
   * Delete Event
   */
  public deleteEvent() {
    this.loader.showLoader();
    this.eventService
      .deleteEvent(this.eventId, { access_token: this.accessToken })
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
      name: '',
      schedule_date: '',
      created_by: '',
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
    if (isDelete && this.pageNumber && this.eventList.length === 1) {
      this.pageNumber = this.pageNumber - 1;
    }
    this.getAllEventList();
  }
  openDescriptionModal(msg) {
    const initialState = {
      modalTitle: 'DESCRIPTION',
      description: msg,
    };
    this.modalRef = this.modalService.show(DescriptionModalComponent, {
      class: 'modal-lg',
      backdrop: 'static',
      initialState,
    });
  }
}

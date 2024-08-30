import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { CONFIGCONSTANTS } from '../../../config/app-constants';
import { BaseComponent } from '../../../_components/base.component';
import { AutoUnsubscribe } from '../../../_decorator/autounsubscribe';
import { ManageEventService } from '../../../_services/manage-event.service';

@Component({
  selector: 'app-event-view',
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.scss'],
})
@AutoUnsubscribe()
export class EventViewComponent extends BaseComponent implements OnInit {
  private _id: number;
  editMode = false;
  private editEventId: number;
  private routeSub: Subscription;
  private eventSub: Subscription;
  model: any = {};
  participantsList = [];
  global_search = '';
  private filteredData = [];

  repeated = {
    never: 'Never',
    daily: 'Daily',
  };
  accessToken: string;
  authInstance: gapi.auth2.GoogleAuth;
  error: string;
  user: gapi.auth2.GoogleUser;
  isAuthenticate = false;
  constructor(private route: ActivatedRoute, private eventService: ManageEventService) {
    super();
  }

  async ngOnInit() {
    this.routeSub = this.route.params.subscribe((params) => {
      this._id = params['id'];
      this.editMode = params['id'] !== undefined;
      setTimeout(async() => {
        if (await this.checkIfUserAuthenticated()) {
          this.user = await this.authInstance.currentUser.get();
          this.accessToken = this.user.getAuthResponse(true).access_token;
        }
        this.initForm();
      }, 100);
    });
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
   * Show number of records in datatable
   * @param value show total entries value 10,25,50,100
   */
  public changeLimit(value) {
    this.size = value;
  }
  private initForm() {
    if (this.editMode) {
      this.eventSub = this.eventService
        .getEventById(this._id, { access_token: this.accessToken })
        .pipe(first())
        .subscribe(
          (response) => {
            const resData = response.data;
            this.editEventId = resData.id || null;
            this.model.eventname = resData.event_name || '';
            this.model.description = resData.event_description || '';
            this.model.repeated = resData.event_repeated || '';
            this.model.send_notification = resData.send_notification;
            this.model.start_datetime = resData.event_start_time;
            this.model.end_datetime = resData.event_end_time;
            this.model.google_meet_link = resData.google_event_link;
            this.model.calendar_link = resData.google_calendar_link;
            this.model.organizer_email_id = resData.organizer_email_id;
            this.participantsList = resData.participants;
            this.filteredData = resData.participants;
          },
          (error) => {
            this.logger.error(error);
          }
        );
    }
  }
  /**
   * Datatabe global search
   * @param event get search input value
   */
  public filterDatatable() {
    // const val = event.target.value.toLowerCase();
    const val = this.global_search.toLowerCase();
    // get the key names of each column in the dataset
    const keys = ['email', 'status'];
    // assign filtered matches to the active datatable
    this.participantsList = this.filteredData.filter(function (item) {
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

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Observable, Subscription } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { CONFIG } from '../../../config/app-config';
import { CONFIGCONSTANTS } from '../../../config/app-constants';
import { BaseComponent } from '../../../_components/base.component';
import { AutoUnsubscribe } from '../../../_decorator/autounsubscribe';
import { ManageEventService } from '../../../_services/manage-event.service';
import { CommonRegx } from '../../../_validators/common.validator';

@Component({
  selector: 'app-event-add-edit',
  templateUrl: './event-add-edit.component.html',
  styleUrls: ['./event-add-edit.component.scss'],
})
@AutoUnsubscribe()
export class EventAddEditComponent extends BaseComponent implements OnInit {
  private _id: number;
  editMode = false;
  private editEventId: number;
  private routeSub: Subscription;
  private eventSub: Subscription;
  private eventSaveSub: Subscription;
  model: any = {};
  isAuthenticate = false;
  authInstance: gapi.auth2.GoogleAuth;
  error: string;
  user: gapi.auth2.GoogleUser;
  accessToken: string;
  authEmail: string;
  minDate: any;
  public emailValidators = [this.isEmail];

  public emailErrorMessages = {
    isEmail: 'Please enter valid email(email@domain.com)',
  };
  constructor(private route: ActivatedRoute, private eventService: ManageEventService, private http: HttpClient) {
    super();
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
  }

  async ngOnInit() {
    this.model.send_notification = false;
    this.routeSub = this.route.params.subscribe((params) => {
      this._id = params['id'];
      this.editMode = params['id'] !== undefined;
      setTimeout(() => {
        this.initForm();
      }, 100);
    });
    if (await this.checkIfUserAuthenticated()) {
      this.user = this.authInstance.currentUser.get();
      this.accessToken = this.user.getAuthResponse(true).access_token;
      this.authEmail = this.user.getBasicProfile().getEmail();
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
  async authenticate(): Promise<gapi.auth2.GoogleUser> {
    // Initialize gapi if not done yet
    if (!this.isAuthenticate) {
      await this.initGoogleAuth();
    }

    // Resolve or reject signin Promise
    return new Promise(async () => {
      await this.authInstance.signIn().then(
        (user) => {
          this.user = user;
          this.accessToken = this.user.getAuthResponse(true).access_token;
          this.authEmail = this.user.getBasicProfile().getEmail();
        },
        (error) => (this.error = error)
      );
    });
  }
  // type = 'date'
  maxEndDate(date) {
    if (date) {
      const dt = new Date(date);
      dt.setDate(dt.getDate() + 1);
      return dt;
    }
  }

  /**
   * Used to set min date for Recurrence date picker
   *
   * @param startDate
   */
  setRecurrenceMinDate(startDate) {
    if (startDate) {
      const recMinDate = new Date(startDate);
      recMinDate.setDate(recMinDate.getDate() + 1);
      return recMinDate;
    }
  }

  /**
   * USed to set max date for Recurrence date picker
   *
   * @param endDate
   */
  setRecurrenceMaxDate(endDate) {
    if (endDate) {
      const recMaxDate = new Date(endDate);
      recMaxDate.setDate(recMaxDate.getDate() - 1);
      return recMaxDate;
    }
  }

  private isEmail(control: FormControl) {
    const EMAIL_REGEXP = CommonRegx.emailRegx;
    if (control.value !== '' && (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))) {
      return { isEmail: true };
    }
    return null;
  }
  public requestAutocompleteItems = (text: string): Observable<String> => {
    const url = CONFIG.getEventActiveUserURL + `?search=${text}`;
    return this.http.get(url).pipe(map((data: any) => data.data.map((item) => item.email)));
  };
  /**
   * Selected input value in edit mode
   */
  private initForm() {
    if (this.editMode) {
      this.eventSub = this.eventService
        .getEventById(this._id, { access_token: this.accessToken })
        .pipe(first())
        .subscribe(
          (response) => {
            const resData = response.data;
            this.editEventId = resData.uuid || null;
            this.model.eventname = resData.event_name || '';
            this.model.description = resData.event_description || '';
            this.model.address = resData.location;
            this.model.send_notification = resData.send_notification === 'true' ? true : false;
            this.model.repeated = resData.event_repeated || '';
            this.model.attendees = resData.participants;
            if (!resData.recurrence_upto || resData.recurrence_upto === '0000-00-00 00:00:00') {
              this.model.recurrence_upto = '';
            } else {
              this.model.recurrence_upto = moment(resData.recurrence_upto).format('MM/DD/YYYY');
            }
            if (!resData.event_start_time || resData.event_start_time === '0000-00-00') {
              this.model.start_datetime = '';
            } else {
              this.model.start_datetime = new Date(resData.event_start_time);
            }
            if (!resData.event_end_time || resData.event_end_time === '0000-00-00') {
              this.model.end_datetime = '';
            } else {
              this.model.end_datetime = new Date(resData.event_end_time);
            }
          },
          (error) => {
            this.logger.error(error);
          }
        );
    }
  }
  /**
   * Create/Update event data
   * @param frm for validate form
   */
  public onEventSave(frm: NgForm) {
    // stop here if form is invalid
    if (frm.invalid) {
      return;
    }
    const reqData = {
      eventName: this.model.eventname,
      eventDescription: this.model.description,
      eventAddress: this.model.address ? this.model.address : '',
      eventStartDateTime: this.model.start_datetime ? this.formatDate(this.model.start_datetime, this.CONSTANT.Api24RequestFormat) : '',
      eventEndDateTime: this.model.end_datetime ? this.formatDate(this.model.end_datetime, this.CONSTANT.Api24RequestFormat) : '',
      recurrence: this.model.repeated,
      recurrence_upto: this.model.repeated === 'daily' ? this.formatDate(this.model.recurrence_upto) : '',
      access_token: this.accessToken,
      email_id: this.authEmail,
      sendNotifications: this.model.send_notification ? 'true' : 'false',
      // sendUpdates:'all'
    };
    if (this.editEventId) {
      const attendees = [];
      this.model.attendees.forEach((val: any, key: any) => {
        attendees.push(val.display);
      });
      reqData['add_attendee'] = attendees.length ? attendees.toString() : '';
      reqData['uuid'] = this.editEventId;
      this.updateEvent(reqData);
    } else {
      this.createEvent(reqData);
    }
  }

  private createEvent(formData) {
    this.loader.showLoader();
    this.eventSaveSub = this.eventService
      .createEvent(formData)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status) {
            this.toastr.success(data.meta.message);
            this.router.navigate(['/event/list']);
          }
        },
        (error) => {
          this.errorHandler(this.toastr, this.translateService, error, () => {
            this.loader.hideLoader();
          });
        }
      );
  }

  private updateEvent(formData) {
    this.loader.showLoader();
    this.eventSaveSub = this.eventService
      .updateEvent(formData)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status) {
            this.toastr.success(data.meta.message);
            this.router.navigate(['/event/list']);
          }
        },
        (error) => {
          this.errorHandler(this.toastr, this.translateService, error, () => {
            this.loader.hideLoader();
          });
        }
      );
  }
}

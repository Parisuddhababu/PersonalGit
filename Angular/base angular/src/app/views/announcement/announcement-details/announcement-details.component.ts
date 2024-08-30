import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import * as moment from 'moment';
import { first } from 'rxjs/operators';
import { CONFIGCONSTANTS } from '../../../config/app-constants';
import {
  announcementInclusion,
  announcementInclusionValue,
  announcementPlatforms,
  announcementStatus,
  announcementType,
  announcementUserRole,
} from '../../../utils/enum-const';
import { BaseComponent } from '../../../_components/base.component';
import { ViewImageModalComponent } from '../../../_modal/view-image.component';
import { AnnouncementService } from '../../../_services/announcement.service';

@Component({
  selector: 'app-announcement-details',
  templateUrl: './announcement-details.component.html',
  styleUrls: ['./announcement-details.component.scss'],
})
export class AnnouncementDetailsComponent extends BaseComponent implements OnInit {
  @ViewChild('iframe') iframe: ElementRef;
  // Get datatble configuration -- start
  @ViewChild(DatatableComponent)
  datatable: DatatableComponent;
  userList = [];
  global_search = '';
  private filteredData = [];
  // Get datatble configuration -- end

  selectedStatus: any = '';
  types = announcementType;
  platforms = announcementPlatforms;
  status = announcementStatus;
  announcement = {
    _id: '',
    title: {},
    description: {},
    status: '',
    type: '',
    user_type: '',
    uuid: '',
    email_attachment: '',
    email_attachment_url: '',
    push_image: '',
    push_image_url: '',
    user_role: '',
    query_string: '',
    inclusion: '',
    registration_start_date: '',
    registration_end_date: '',
  };
  inclusion = announcementInclusion;
  inclusionEnum = announcementInclusionValue;
  userRole = announcementUserRole;
  _uuid: String;
  constructor(private route: ActivatedRoute, private announcementService: AnnouncementService) {
    super();
  }

  async ngOnInit() {
    this.route.params.subscribe((params) => {
      this._uuid = params['id'];
    });
    this.getAnnouncementDetails();
  }

  /**
   * Announcement List Details
   */
  public getAnnouncementDetails() {
    this.loader.showLoader();
    this.announcementService
      .getAnnouncementDetailsById({ uuid: this._uuid })
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          const resData = data.data;
          this.announcement = {
            _id: data['data']['_id'],
            type: data['data']['type'],
            title: {},
            description: {},
            user_type: data['data']['user_type'],
            status: data['data']['status'],
            uuid: data['data']['uuid'],
            email_attachment: data['data']['email_attachment'],
            email_attachment_url: data['data']['email_attachment_url'],
            push_image: data['data']['push_image'],
            push_image_url: data['data']['push_image_url'],
            user_role: data['data']['user_role'],
            query_string: data['data']['query_string'],
            inclusion: data['data']['inclusion'],
            registration_start_date: data['data']['registration_start_date'],
            registration_end_date: data['data']['registration_end_date'],
          };
          this.userList = data['data']['selection_set'];
          this.filteredData = data['data']['selection_set'];

          resData.translations.forEach((element) => {
            this.announcement.title[element.locale] = element.title;
            this.announcement.description[element.locale] = element.description;
          });
        },
        (error) => {
          this.errorHandler(this.toastr, this.translateService, error, () => {
            this.loader.hideLoader();
          });
        }
      );
  }
  /**
   * For Date Format Display
   * @param date
   */
  getDateInformate(date) {
    return moment(date).format(CONFIGCONSTANTS['momentDateTime24Format']);
  }

  /**
   * Show number of records in datatable
   * @param value show total entries value 10,25,50,100
   */
  public changeLimit(value) {
    this.size = value;
  }

  /**
   * Datatabe global search
   * @param event get search input value
   */
  public filterDatatable(event) {
    const val = event.target.value.toLowerCase();
    // get the key names of each column in the dataset
    const keys = ['first_name', 'email', 'device_type', 'role', 'created_at'];
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

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import {
  announcementInclusion,
  announcementInclusionValue,
  announcementPlatforms,
  announcementType,
  announcementTypeValue,
  announcementUserRole
} from '../../../utils/enum-const';
import { BaseComponent } from '../../../_components/base.component';
import { AutoUnsubscribe } from '../../../_decorator/autounsubscribe';
import { AnnouncementService } from '../../../_services/announcement.service';

@Component({
  selector: 'app-announcement-add-edit',
  templateUrl: './announcement-add-edit.component.html',
  styleUrls: ['./announcement-add-edit.component.scss'],
})
@AutoUnsubscribe()
export class AnnouncementAddEditComponent extends BaseComponent implements OnInit {
  @ViewChild('f', { static: true }) form: any;
  submitted = false;
  types = announcementType;
  typesEnum = announcementTypeValue;
  platforms = announcementPlatforms;
  userRole = announcementUserRole;
  inclusions = announcementInclusion;
  inclusionEnum = announcementInclusionValue;
  model = {
    announcement_title: {},
    announcement_description: {},
  };
  announcement_type = '';
  announcement_user_type = 'all';
  user_role = 'ALL';
  advanced_filter = this.inclusionEnum.all;
  push_image_resource: string;
  email_attachment_resource: any;
  emailAttachmentLabel: string;
  push_image: any;
  email_attachment: any = null;
  topicListData: any;
  routeSub: Subscription;
  announcementSub: Subscription;
  announcementSaveSub: Subscription;
  announcement_status = 'Active';
  announcement_name: string;
  isOpen = false;
  addEditCmsForm: FormGroup;
  pushImageSource: any;
  tableInitiated = false;
  selected_days = '';
  query = '';
  totalRecord = 0;
  isChecked = false;
  selectedUserList = [];
  sorting_order: number;
  order_drop_down_change;

  userList = [];

  desc_error = {};
  ckConfig = this.CONSTANT.CKEditorConfig;

  constructor(private announcementService: AnnouncementService) {
    super();
  }

  ngOnInit() {
    this.languages.forEach((element) => {
      this.desc_error[element.locale] = true;
    });
    this.sorting_order = 0;
    this.order_drop_down_change = false;
  }

  /**
   * For Filter Apply
   */
  filter() {
    this.rerender(true);
  }

  openTree() {
    this.isOpen = this.isOpen === true ? false : true;
  }

  /**
   * Remove User From Checked List
   * @param id
   */
  removeUser(id) {
    const index = this.selectedUserList.findIndex((value) => value.uuid === id);
    this.selectedUserList.splice(index, 1);
    const index1 = this.userList.findIndex((value) => value.uuid === id);
    if (index1 !== -1) {
      this.userList[index1].selected = false;
    }

    let totalSelected = 0;
    this.userList.forEach((element) => {
      const ind = this.selectedUserList.findIndex((value) => value.uuid === element.uuid);
      if (ind !== -1) {
        totalSelected = totalSelected + 1;
      }
    });
    if (totalSelected === this.totalRecord) {
      this.isChecked = true;
    } else {
      this.isChecked = false;
    }
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
  public rerender(goFirstPage): void {
    if (goFirstPage) {
      this.pageNumber = 0;
    }
    this.fetchUserTable();
  }
  resetSearch() {
    this.query = '';
    this.pageNumber = 0;
    this.fetchUserTable();
  }
  /**
   * For Checkbox User List
   */
  fetchUserTable() {
    this.pageNumber = 0;
    if (this.advanced_filter === this.inclusionEnum.all) {
      this.selectedUserList = [];
      this.userList = [];
    } else {
      const requestObject = {
        start: this.pageNumber * this.size,
        length: this.size,
        platform: this.announcement_user_type,
        query_string: this.query,
        registration_start_date: this.selected_days ? moment(this.selected_days['0']).format(this.momentDateFormat) : '',
        registration_end_date: this.selected_days ? moment(this.selected_days['1']).format(this.momentDateFormat) : '',
      };
      this.announcementService
        .getAnnouncementUserSelectionList(requestObject)
        .pipe(first())
        .subscribe(
          (resp) => {
            this.order_drop_down_change = false;
            this.isChecked = false;
            let totalSelected = 0;
            this.userList = resp.data['original'].data;
            this.totalReords = resp.data['original'].recordsTotal;
            this.userList.forEach((element) => {
              element.selected = false;
              const index = this.selectedUserList.findIndex((value) => value.uuid === element.uuid);
              if (index !== -1) {
                element.selected = true;
                totalSelected = totalSelected + 1;
              }
            });
            if (totalSelected === resp.data['original'].data.length) {
              this.isChecked = true;
            }
          },
          (error) => {
            this.logger.log('Data not Fetch');
          }
        );
    }
  }

  /**
   * For Contact Number Double plus than remove one
   */
  removeAdditionalPlus(mobile) {
    return mobile.replace('++', '+');
  }

  /**
   * All Listed User Check
   */
  checkuncheckall() {
    if (this.isChecked === true) {
      this.isChecked = false;
      this.userList.forEach((element) => {
        element.selected = false;
        const index = this.selectedUserList.findIndex((value) => value.uuid === element.uuid);
        if (index !== -1) {
          this.selectedUserList.splice(index, 1);
        }
      });
    } else {
      this.isChecked = true;
      this.userList.forEach((element) => {
        element.selected = true;
        const index = this.selectedUserList.findIndex((value) => value.uuid === element.uuid);
        if (index === -1) {
          this.selectedUserList.push({
            uuid: element.uuid,
            name: element.first_name,
          });
        }
      });
    }
  }

  /**
   * For single checkbox check
   * @param id
   * @param name
   * @param selected
   */
  checkunchecksingle(id, name, selected) {
    if (selected === true) {
      this.selectedUserList.push({ uuid: id, name: name });
    } else {
      const index = this.selectedUserList.findIndex((value) => value.uuid === id);
      this.selectedUserList.splice(index, 1);
    }
    if (this.userList.length === this.selectedUserList.length) {
      this.isChecked = true;
    } else {
      this.isChecked = false;
    }
  }

  /**
   * For save new Announcement
   */
  async onAnnouncementSave() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    this.languages.forEach((element) => {
      if (this.desc_error[element.locale] === true) {
        return;
      }
    });
    if (this.advanced_filter === this.inclusionEnum.only_selected || this.advanced_filter === this.inclusionEnum.exclude_selected) {
      if (this.selectedUserList.length === 0) {
        const message = await this.getTranslation('SELECT_USER_VALIDATION', null);
        this.toastr.error(message);
        this.submitted = false;
        return;
      }
    }
    const formdata = new FormData();
    formdata.append('title', JSON.stringify(this.model.announcement_title));
    formdata.append('description', JSON.stringify(this.model.announcement_description));
    formdata.append('type', this.announcement_type);
    formdata.append('user_type', this.announcement_user_type);
    formdata.append('user_role', this.user_role);
    formdata.append('inclusion', this.advanced_filter);
    formdata.append('registration_start_date', this.selected_days ? moment(this.selected_days['0']).format('YYYY-MM-DD') : '');
    formdata.append('registration_end_date', this.selected_days ? moment(this.selected_days['1']).format('YYYY-MM-DD') : '');
    for (let i = 0; i < this.selectedUserList.length; i++) {
      formdata.append('selections[' + i + ']', this.selectedUserList[i].uuid);
    }
    if (this.announcement_type === this.typesEnum.push && this.push_image) {
      formdata.append('push_image', this.push_image);
    } else if (this.announcement_type === this.typesEnum.email && this.email_attachment) {
      formdata.append('email_attachment', this.email_attachment);
    }
    this.createAnnouncement(formdata);
  }

  /**
   * for Create Api call with Parameters
   * @param formData
   */
  createAnnouncement(formData) {
    this.loader.showLoader();
    this.announcementService
      .createAnnouncement(formData)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status) {
            this.toastr.success(data.meta.message);
            this.router.navigate(['/manage-announcement/list']);
          }
        },
        (error) => {
          this.errorHandler(this.toastr, this.translateService, error, () => {
            this.loader.hideLoader();
            this.submitted = false;
          });
        }
      );
  }

  /**
   * For Select Push Image and Email Attachment
   * @param event
   */
  onSelectFile(event) {
    const img = event;
    if (event.target.files && event.target.files[0]) {
      const filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        const reader = new FileReader();
        reader.readAsDataURL(event.target.files[i]);
        reader.onload = (file: any) => {
          this.push_image = event.target.files[i];
          this.pushImageSource = reader.result;
        };
      }
    }
  }

  /**
   * Attach a file
   * @param event
   */
  onSelectAttachmentFile(event) {
    const img = event;
    if (event.target.files && event.target.files[0]) {
      const filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        const reader = new FileReader();
        this.email_attachment = event.target.files[i];
        this.emailAttachmentLabel = event.target.files[i].name;
      }
    }
  }

  /**
   * For reset Email and push image Attachment
   * @param type
   */
  resetMedia(type) {
    if (type === 'email') {
      this.email_attachment = null;
      this.emailAttachmentLabel = null;
      this.email_attachment_resource = null;
    } else {
      this.push_image = null;
      this.pushImageSource = null;
      this.push_image_resource = null;
    }
  }
  getDescData(type, lan_direction) {
    if (lan_direction === 'LTR') {
      const a = this.model.announcement_description[type].substring(
        this.model.announcement_description[type].indexOf('<body>') + 6,
        this.model.announcement_description[type].indexOf('</body>')
      );
      this.desc_error[type] = a.length > 0 ? false : true;
    }
    if (lan_direction === 'RTL') {
      const a = this.model.announcement_description[type].substring(
        this.model.announcement_description[type].indexOf('<body dir="rtl">') + 16,
        this.model.announcement_description[type].indexOf('</body>')
      );
      this.desc_error[type] = a.length > 0 ? false : true;
    }
  }
  resetDescription() {
    this.model.announcement_description = {};
  }
}

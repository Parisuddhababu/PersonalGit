import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { IDropdownSettings } from 'ng-multiselect-dropdown/multiselect.model';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { CONFIGCONSTANTS } from '../../../config/app-constants';
import { BaseComponent } from '../../../_components/base.component';
import { AutoUnsubscribe } from '../../../_decorator/autounsubscribe';
import { ManageuserService } from '../../../_services/manageuser-service';
import { SurveyService } from '../../../_services/survey.service';

@Component({
  selector: 'app-survey-add-edit',
  templateUrl: './survey-add-edit.component.html',
  styleUrls: ['./survey-add-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
@AutoUnsubscribe()
export class SurveyAddEditComponent extends BaseComponent implements OnInit {
  private _id: number;
  editMode = false;
  editSurveyId: number;
  private routeSub: Subscription;
  private surveySub: Subscription;
  private surveySaveSub: Subscription;
  model: any = {};
  minDate: any;

  locationList = [];
  departmentList = [];
  readonly locationSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'uuid',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    noDataAvailablePlaceholderText: 'No Location Found',
    searchPlaceholderText: 'Search Location',
  };
  readonly departmentSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'uuid',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    noDataAvailablePlaceholderText: 'No Department Found',
    searchPlaceholderText: 'Search Department',
  };
  constructor(private route: ActivatedRoute, private surveyService: SurveyService, private manageuserService: ManageuserService) {
    super();
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
  }

  ngOnInit() {
    this.getDepartmentList();
    this.getLocationList();
    this.routeSub = this.route.params.subscribe((params) => {
      this._id = params['id'];
      this.editMode = params['id'] !== undefined;
      setTimeout(() => {
        this.initForm();
      }, 100);
    });
  }
  getDepartmentList() {
    this.manageuserService
      .getActiveCategoryList(CONFIGCONSTANTS.departmentId)
      .pipe(first())
      .subscribe((data) => {
        if (!data.data) {
          this.departmentList = [];
        } else {
          this.departmentList = data.data;
        }
      });
  }
  getLocationList() {
    this.manageuserService
      .getActiveCategoryList(CONFIGCONSTANTS.locationId)
      .pipe(first())
      .subscribe((data) => {
        if (!data.data) {
          this.locationList = [];
        } else {
          this.locationList = data.data;
        }
      });
  }
  /**
   * Selected input value in edit mode
   */
  private initForm() {
    if (this.editMode) {
      this.surveySub = this.surveyService
        .getSurveyById(this._id)
        .pipe(first())
        .subscribe(
          (response) => {
            const resData = response.data;
            this.editSurveyId = resData.uuid || null;
            this.model.title = resData.title || '';
            this.model.description = resData.description || '';
            this.model.is_started = resData.is_started && resData.is_started === 'yes';
            this.model.department_ids = this.departmentList.filter((ele) => resData.department_ids.includes(ele.uuid));
            this.model.location_ids = this.locationList.filter((ele) => resData.location_ids.includes(ele.uuid));

            if (!resData.survey_start_date || resData.survey_start_date === '0000-00-00') {
              this.model.survey_start_date = '';
            } else {
              this.model.survey_start_date = moment(resData.survey_start_date).format('MM/DD/YYYY');
            }
            if (!resData.survey_end_date || resData.survey_end_date === '0000-00-00') {
              this.model.survey_end_date = '';
            } else {
              this.model.survey_end_date = moment(resData.survey_end_date).format('MM/DD/YYYY');
            }
          },
          (error) => {
            this.logger.error(error);
          }
        );
    }
  }
  maxEndDate(date) {
    if (date) {
      const dt = new Date(date);
      dt.setDate(dt.getDate());
      return dt;
    }
  }
  public surveyStartNow(isStart) {
    if (isStart) {
      this.model.survey_start_date = new Date();
    } else {
      this.model.survey_start_date = '';
      this.model.survey_end_date = '';
    }
  }
  /**
   * Create/Update Survey data
   * @param frm for validate form
   */
  public async onSurveySave(frm: NgForm) {
    // stop here if form is invalid
    if (frm.invalid) {
      return;
    }
    if (Date.parse(this.model.survey_start_date) >= Date.parse(this.model.survey_end_date)) {
      const message = await this.getTranslation('END_DATE_GREATER_THEN_START_DATE');
      this.toastr.error(message);
      return;
    }
    const formData: FormData = new FormData();
    formData.append('title', this.model.title);
    formData.append('description', this.model.description);
    formData.append(
      'department_ids',
      this.model.department_ids.map((ele) => ele.uuid)
    );
    formData.append(
      'location_ids',
      this.model.location_ids.map((ele) => ele.uuid)
    );
    formData.append('survey_start_date', this.model.survey_start_date ? this.formatDate(this.model.survey_start_date) : '');
    formData.append('survey_end_date', this.model.survey_end_date ? this.formatDate(this.model.survey_end_date) : '');
    if (this.editSurveyId) {
      // formData.append('survey_uuid', this.editSurveyId.toString());
      const data = {
        ...this.model
      };
      data['survey_start_date'] = this.model.survey_start_date ? this.formatDate(this.model.survey_start_date) : '';
      data['survey_end_date'] = this.model.survey_end_date ? this.formatDate(this.model.survey_end_date) : '';
      data['department_ids'] = data.department_ids.map((ele) => ele.uuid).reduce((prev, next) => `${prev},${next}`);
      data['location_ids'] = data.location_ids.map((ele) => ele.uuid).reduce((prev, next) => `${prev},${next}`);
      this.updateSurvey({
        ...data,
        survey_uuid: this.editSurveyId.toString()
      });
    } else {
      this.createSurvey(formData);
    }
  }

  private createSurvey(formData) {
    this.loader.showLoader();
    this.surveySaveSub = this.surveyService
      .createSurvey(formData)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status) {
            this.toastr.success(data.meta.message);
            this.router.navigate(['/manage-survey/add-questions/' + data.data.uuid]);
          }
        },
        (error) => {
          this.errorHandler(this.toastr, this.translateService, error, () => {
            this.loader.hideLoader();
          });
        }
      );
  }

  private updateSurvey(formData) {
    this.loader.showLoader();
    this.surveySaveSub = this.surveyService
      .updateSurvey(formData)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status) {
            this.toastr.success(data.meta.message);
            this.router.navigate(['/manage-survey/add-questions/' + this.editSurveyId]);
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

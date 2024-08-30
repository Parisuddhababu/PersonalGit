import { Component, OnInit, TemplateRef } from '@angular/core';
import { first } from 'rxjs/operators';
import { BaseComponent } from '../../../_components/base.component';
import { SurveyService } from '../../../_services/survey.service';
import { SurveyUserReportComponent } from './user-report.component';

@Component({
  selector: 'app-survey-list',
  templateUrl: './survey-list.component.html',
  styleUrls: ['./survey-list.component.scss'],
})
export class SurveyListComponent extends BaseComponent implements OnInit {
  surveyList = [];
  sortParam = 'created_at';
  sortOrder = 'desc';
  filter = this.defaultFilterData;
  private surveyId: number;
  private changeStatusType: string;
  private changedStatus: string;
  constructor(private surveyService: SurveyService) {
    super();
  }

  ngOnInit() {
    this.filter = this.filterService.getState('adSurveyFilter', this.filter);
    this.sortParam = this.filterService.getSingleState('adSurveySortParam', this.sortParam);
    this.sortOrder = this.filterService.getSingleState('adSurveySortOrder', this.sortOrder);
    this.pageNumber = this.filterService.getSingleState('adSurveyPageNo', this.pageNumber);
    this.size = this.filterService.getSingleState('adSurveySize', this.size);
    this.getSurveyList();
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
   * Get Survey list data
   */
  private getSurveyList() {
    // For save filter, sorting, pagenumber and size in storage
    this.filterService.saveState('adSurveyFilter', this.filter);
    this.filterService.saveSingleState('adSurveySortParam', this.sortParam);
    this.filterService.saveSingleState('adSurveySortOrder', this.sortOrder);
    this.filterService.saveSingleState('adSurveyPageNo', this.pageNumber);
    this.filterService.saveSingleState('adSurveySize', this.size);
    this.loadingIndicator = true;
    this.surveyService
      .getSurveyList({
        title: this.filter.title,
        status: this.filter.status,
        survey_status: this.filter.survey_status,
        start: this.pageNumber * this.size,
        length: this.size,
        sort_param: this.sortParam,
        sort_type: this.sortOrder,
      })
      .pipe(first())
      .subscribe(
        (resp) => {
          this.loadingIndicator = false;
          const respData = resp.data['original'];
          this.surveyList = respData.data;
          this.totalReords = respData.recordsTotal;
        },
        (error) => {
          this.loadingIndicator = false;
        }
      );
  }

  /* Open any Modal Popup */
  openModal(template: TemplateRef<any>, id, status) {
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
    this.surveyId = id;
    this.changeStatusType = status;
  }

  decline(): void {
    this.modalRef.hide();
  }
  /**
   * Change user status Active or Inactive
   */
  public changeStatus() {
    this.changedStatus = this.changeStatusType === this.statusEnum.active ? this.statusEnum.inactive : this.statusEnum.active;
    this.loader.showLoader();
    this.surveyService
      .changeSurveyStatus(this.changedStatus, this.surveyId)
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
  /**
   * Delete survey
   */
  public deleteSurvey() {
    this.loader.showLoader();
    this.surveyService
      .deleteSurvey(this.surveyId)
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

  public searchApply() {
    this.rerender(true);
  }
  get defaultFilterData() {
    return {
      title: '',
      status: '',
      survey_status: '',
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
    if (isDelete && this.pageNumber && this.surveyList.length === 1) {
      this.pageNumber = this.pageNumber - 1;
    }
    this.getSurveyList();
  }
  public getRowClass(row) {
    return {
      'survey-bg-green': row.is_completed === 'no' && row.is_started === 'yes',
      'survey-bg-red': row.is_completed === 'yes' && row.is_started === 'yes',
      'survey-bg-yellow': row.is_completed === 'no' && row.is_started === 'no',
    };
  }
  /* Open any Modal Popup */
  openModalUserReport(uuid) {
    const initialState = {
      surveyUuid: uuid,
    };
    this.modalRef = this.modalService.show(SurveyUserReportComponent, {
      class: 'modal-lg',
      initialState,
    });
  }
}

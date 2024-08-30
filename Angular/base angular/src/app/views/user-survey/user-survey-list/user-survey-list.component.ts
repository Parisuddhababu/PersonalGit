import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { BaseComponent } from '../../../_components/base.component';
import { SurveyService } from '../../../_services/survey.service';

@Component({
  selector: 'app-user-survey-list',
  templateUrl: './user-survey-list.component.html',
  styleUrls: ['./user-survey-list.component.scss'],
})
export class UserSurveyListComponent extends BaseComponent implements OnInit {
  surveyList = [];
  sortParam = '';
  sortOrder = '';

  title = '';
  survey_status = '';
  constructor(private surveyService: SurveyService) {
    super();
  }

  ngOnInit() {
    this.getActiveSurveyList();
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
  private getActiveSurveyList() {
    this.loadingIndicator = true;
    this.surveyService
      .getActiveSurveyList({
        title: this.title,
        has_submitted: this.survey_status,
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
  public searchApply() {
    this.rerender(true);
  }

  public resetSearch() {
    this.title = '';
    this.survey_status = '';
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
    this.getActiveSurveyList();
  }
  public getRowClass(row) {
    return {
      'survey-bg-green': row.has_submitted === 'yes',
      'survey-bg-red': row.has_submitted === 'no',
    };
  }
}

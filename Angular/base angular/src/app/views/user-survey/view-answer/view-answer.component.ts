import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { first } from 'rxjs/operators';
import { SurveyService } from '../../../_services/survey.service';
import { LoggerService } from './../../../_services/logger.service';

@Component({
  selector: 'app-view-answer',
  templateUrl: './view-answer.component.html',
  styleUrls: ['./view-answer.component.scss'],
})
export class ViewAnswerComponent implements OnInit {
  // Question Object model
  questionList: any[] = [];
  _id: any;
  editMode: boolean;
  model: any = {};
  quesUuid: any;
  constructor(private route: ActivatedRoute,
    private surveyService: SurveyService,
    private logger: LoggerService) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this._id = params['id'];
      this.editMode = params['id'] !== undefined;
      if (this.editMode) {
        this.initForm();
      }
    });
  }
  initForm() {
    // Get Survey Data by Id
    if (this.editMode) {
      this.surveyService
        .getAnswerDetailsById(this._id)
        .pipe(first())
        .subscribe(
          (response) => {
            const resData = response.data.survey_meta;
            this.questionList = response.data.answers;
            this.model.title = resData.title || '';
            this.model.description = resData.description || '';
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
}

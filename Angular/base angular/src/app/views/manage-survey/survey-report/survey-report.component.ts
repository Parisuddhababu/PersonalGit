import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { SurveyService } from '../../../_services/survey.service';
import { LoggerService } from './../../../_services/logger.service';
import { CheckUserListComponent } from './check-user-list.component';
import { TextUserListComponent } from './text-user-list.component';

@Component({
  selector: 'app-survey-report',
  templateUrl: './survey-report.component.html',
  styleUrls: ['./survey-report.component.scss'],
})
export class SurveyReportComponent implements OnInit {
  modalRef: BsModalRef;
  // Question Object model
  questionList: any[] = [];
  _id: any;
  editMode: boolean;
  model: any = {};
  quesUuid: any;
  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private modalService: BsModalService,
    private surveyService: SurveyService,
    private logger: LoggerService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this._id = params['id'];
      this.editMode = params['id'] !== undefined;
      if (this.editMode) {
        this.initForm();
      }
    });
  }
  // initailzation if Survey question has edit mode
  initForm() {
    // Get Survey Data by Id
    if (this.editMode) {
      this.surveyService
        .getSurveyDetailsById(this._id)
        .pipe(first())
        .subscribe(
          (response) => {
            const resData = response.data.survey_meta;
            this.questionList = response.data.questions;
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

  /* Open any Modal Popup */
  openModalText(uuid, ques) {
    const initialState = {
      quesUuid: uuid,
      question: ques,
    };
    this.modalRef = this.modalService.show(TextUserListComponent, {
      class: 'modal-lg',
      initialState,
    });
  }
  openModalCheck(uuid, ques, opt) {
    const initialState = {
      ansUuid: uuid,
      question: ques,
      option: opt,
    };
    this.modalRef = this.modalService.show(CheckUserListComponent, {
      class: 'modal-lg',
      initialState,
    });
  }

  decline(): void {
    this.modalRef.hide();
  }
}

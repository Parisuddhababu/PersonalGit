import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { BaseComponent } from '../../../_components/base.component';
import { SurveyService } from '../../../_services/survey.service';

@Component({
  selector: 'app-survey-answers',
  templateUrl: './survey-answers.component.html',
  styleUrls: ['./survey-answers.component.scss'],
})
export class SurveyAnswersComponent extends BaseComponent implements OnInit {
  // Question Object model
  questionList: any[] = [];
  _id: any;
  editMode: boolean;
  constructor(private route: ActivatedRoute, private surveyService: SurveyService) {
    super();
  }

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
    this.surveyService
      .getSurveyQuesAnsById(this._id)
      .pipe(first())
      .subscribe((Response: any) => {
        const resdata = Response.data;
        this.questionList = resdata || [];
      });
  }
  onSurveyAnswerDataSave(frm: NgForm) {
    if (frm.invalid) {
      return;
    }
    const formData: FormData = new FormData();
    formData.append('survey_uuid', this._id);
    this.questionList.forEach((element, key) => {
      formData.append('questions[' + key + '][question_id]', element.id);
      formData.append('questions[' + key + '][answer_type]', element.answer_type);
      if (element.answer_type === 'text') {
        formData.append('questions[' + key + '][answer]', element.text_answer);
      }
      if (element.answer_type === 'single_check') {
        formData.append('questions[' + key + '][answer]', element.single_answer);
      }
      if (element.answer_type === 'multi_check') {
        element.answer_options.forEach((val, ke) => {
          if (val.multi_answer) {
            formData.append('questions[' + key + '][answer][' + ke + ']', val.id);
          }
        });
      }
    });
    this.loader.showLoader();
    this.surveyService
      .updateUserSurveyAns(formData)
      .pipe(first())
      .subscribe(
        (response: any) => {
          this.loader.hideLoader();
          if (response.meta.status) {
            this.toastr.success(response.meta.message);
            this.router.navigate(['/user-survey/list']);
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

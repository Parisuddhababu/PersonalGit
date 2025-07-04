import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { BaseComponent } from '../../../_components/base.component';
import { SurveyService } from '../../../_services/survey.service';

@Component({
  selector: 'app-survey-questions',
  templateUrl: './survey-questions.component.html',
  styleUrls: ['./survey-questions.component.scss'],
})
export class SurveyQuestionsComponent extends BaseComponent implements OnInit {
  // Question Object model
  questionList: any[] = [];
  // Get Total Answer
  totalAnswer = 0;
  _id: any;
  editMode: boolean;
  surveyTitle: string;
  isUpdateQues = false;
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
    // On page render initialize by default one question & answer
    this.addMoreQuestions();
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
        if (this.questionList.length > 0) {
          this.isUpdateQues = true;
          this.questionList.map((que: any, i) => {
            que.question_no = `que-${i + 1}`;
            const answerData: any[] = que.answer_options || [];
            this.questionList[i].answers = [];
            this.questionList[i].answers = answerData.map((ans: any, j) => {
              return {
                answer: ans.answer,
              };
            });
            if (this.questionList[i].answers.length === 0 && this.questionList[i].answer_type === 'text') {
              this.questionList[i].answers = [
                {
                  answer: '',
                }
              ];
            }
          });
        } else {
          this.addMoreQuestions();
        }
      });
  }

  // Add Questions & Answer on API
  onSurveyQuestionDataSave(frm: NgForm) {
    if (frm.invalid) {
      return;
    }
    const formData: FormData = new FormData();
    formData.append('survey_uuid', this._id);
    this.questionList.forEach((element, key) => {
      // if (this.isUpdateQues && element.uuid) {
      //   formData.append('questions[' + key + '][id]', element.uuid);
      // }
      formData.append('questions[' + key + '][question]', element.question);
      formData.append('questions[' + key + '][answer_type]', element.answer_type);
      if (element.answer_type !== 'text') {
        element.answers.forEach((val, ke) => {
          formData.append('questions[' + key + '][answers][' + ke + ']', val.answer);
        });
      }
    });
    if (this.isUpdateQues) {
      this.updateSurveyQuesAns(formData);
    } else {
      this.createSurveyQuesAns(formData);
    }
  }
  createSurveyQuesAns(formData) {
    this.loader.showLoader();
    this.surveyService
      .createSurveyQuesAns(formData)
      .pipe(first())
      .subscribe(
        (response: any) => {
          this.loader.hideLoader();
          if (response.meta.status) {
            this.toastr.success(response.meta.message);
            this.router.navigate(['/manage-survey/list']);
          }
        },
        (error) => {
          this.errorHandler(this.toastr, this.translateService, error, () => {
            this.loader.hideLoader();
          });
        }
      );
  }
  updateSurveyQuesAns(formData) {
    this.loader.showLoader();
    this.surveyService
      .updateSurveyQuesAns(formData)
      .pipe(first())
      .subscribe(
        (response: any) => {
          this.loader.hideLoader();
          if (response.meta.status) {
            this.toastr.success(response.meta.message);
            this.router.navigate(['/manage-survey/list']);
          }
        },
        (error) => {
          this.errorHandler(this.toastr, this.translateService, error, () => {
            this.loader.hideLoader();
          });
        }
      );
  }
  // Add question when user trigger Add more question
  addMoreQuestions() {
    this.addQuestion();
  }

  /**
   * @$Q_no : question number generated by length
   * Add more answer in question
   * max 10 answer allow
   */
  addMoreAnswer($Q_no: string) {
    // use loop for Add answer
    this.questionList.map((que: any, i) => {
      if (que.question_no === $Q_no) {
        // get length from current answer
        const $and_length = que.answers.length;
        // if answer length more than 10, then answer will be not add
        if ($and_length < 10) {
          que.answers.push({
            answer: '',
          });
        } else {
          // An error, if answer more then 10, then display error message
          this.toastr.error('You can add max 10 answer per questions');
        }
      }
    });
  }

  /**
   *
   * @param $Q_no is an Question no
   * it's an unique
   */
  removeQuestions($Q_no: string) {
    this.questionList.map((que: any, i) => {
      if (que.question_no === $Q_no) {
        this.questionList.splice(i, 1);
      }
    });
  }

  /**
   * Remove Answer in Question
   * @param $Q_no is Question no
   * @param $ans_index is index of Question answer
   */

  removeExistAnswer($Q_no, $ans_index) {
    this.questionList.map((que: any, i) => {
      // if question is match to $Q_no
      if (que.question_no === $Q_no) {
        // get All Answer into temp variable
        const $Answer: any[] = que.answers;
        // remove answer
        $Answer.splice($ans_index, 1);
        // assign freash variable value
        que.answers = $Answer;
        // display remove answer message
      }
    });
  }
  // Add more question
  addQuestion(ansType = "multi_check"): void {
    let $question_length = this.questionList.length;
    this.questionList.push({
      question_no: `que_${++$question_length}`,
      question: '',
      answers: [{ answer: '' }],
      answer_type: ansType,
    });
  }
  onAnsTypeChange($event, ques) {
    console.log($event, ques);
  }
}

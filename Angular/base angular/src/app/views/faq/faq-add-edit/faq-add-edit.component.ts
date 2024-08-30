import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { BaseComponent } from '../../../_components/base.component';
import { AutoUnsubscribe } from '../../../_decorator/autounsubscribe';
import { ManageuserService } from '../../../_services/manageuser-service';
import { Faq } from './../../../model/faq';
import { FaqService } from './../../../_services/faq-service';

@Component({
  selector: 'app-faq-add-edit',
  templateUrl: './faq-add-edit.component.html',
  styleUrls: ['./faq-add-edit.component.scss'],
})
@AutoUnsubscribe()
export class FaqAddEditComponent extends BaseComponent implements OnInit {
  @ViewChild('faqFrm', { static: true }) form: any;

  private _id: number;
  editMode = false;
  private editFaqId: number;
  faq_subject: string;
  faq_body: string;
  topicListData: any;
  private routeSub: Subscription;
  private faqSub: Subscription;
  private faqTopicList: Subscription;
  private faqSaveSub: Subscription;
  model: any = new Faq({}, '', {}, '', this.statusEnum.active);
  addEditCmsForm: FormGroup;

  constructor(private route: ActivatedRoute, private faqService: FaqService, private manageuserService: ManageuserService) {
    super();
    this.languages.forEach(l => {
      this.model["question"][l.locale] = "";
      this.model["answer"][l.locale] = "";
    });
  }

  ngOnInit() {
    this.faqTopicList = this.faqService
      .getFaqTopicList()
      .pipe(first())
      .subscribe(
        (response) => {
          this.topicListData = response.data;
        },
        (error) => {
          this.logger.error(error);
        }
      );

    this.routeSub = this.route.params.subscribe((params) => {
      this._id = params['id'];
      this.editMode = params['id'] !== undefined;
      setTimeout(() => {
        this.initForm();
      }, 100);
    });
  }
  /**
   * Selected input value in edit mode
   */
  private initForm() {
    if (this.editMode) {
      this.faqSub = this.faqService
        .getFaqById(this._id)
        .pipe(first())
        .subscribe(
          (response) => {
            this.editFaqId = response.data.id || null;
            this.model.faq_topic = response.data.faq_topic_details.uuid || '';
            this.model.status = response.data.status || this.statusEnum.active;
            response.data.translation.forEach(e => {
              this.model.question[e.locale] = e.question;
              this.model.answer[e.locale] = e.answer;
            });
          },
          (error) => {
            this.logger.error(error);
          }
        );
    }
  }
  /**
   * Create/Update FAQ data
   */
  public onFaqSave() {
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    const data = {
      faq_topic_id: this.model.faq_topic,
      question: this.model.question,
      answer: this.model.answer,
      status: this.model.status,
    };

    if (this.editFaqId) {
      this.updateFaq(data, this.editFaqId);
    } else {
      this.createFaq(data);
    }
  }

  private createFaq(formData) {
    this.loader.showLoader();
    this.faqSaveSub = this.faqService
      .createFaq(formData)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status) {
            this.toastr.success(data.meta.message);
            this.router.navigate(['/faq/list']);
          }
        },
        (error) => {
          this.errorHandler(this.toastr, this.translateService, error, () => {
            this.loader.hideLoader();
          });
        }
      );
  }

  private updateFaq(formData, id) {
    this.loader.showLoader();
    this.faqSaveSub = this.faqService
      .updateFaq(formData, id)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status) {
            this.toastr.success(data.meta.message);
            this.router.navigate(['/faq/list']);
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

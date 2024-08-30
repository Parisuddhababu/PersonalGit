import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { BaseComponent } from '../../../_components/base.component';
import { AutoUnsubscribe } from '../../../_decorator/autounsubscribe';
import { ManageuserService } from '../../../_services/manageuser-service';
import { Email } from './../../../model/email';
import { EmailService } from './../../../_services/email-service';

@Component({
  selector: 'app-email-add-edit',
  templateUrl: './email-add-edit.component.html',
  styleUrls: ['./email-add-edit.component.scss'],
})
@AutoUnsubscribe()
export class EmailAddEditComponent extends BaseComponent implements OnInit {
  @ViewChild('emailFrm', { static: true }) form: any;

  private _id: number;
  editMode = false;
  private editCmsId: number;
  model: any = {};
  email_subject: string;
  email_body: string;
  template_for: string;
  templateType: string;
  private routeSub: Subscription;
  private emailSub: Subscription;
  private emailSaveSub: Subscription;
  config: any;
  addEditCmsForm: FormGroup;
  ck_error = {};

  constructor(private route: ActivatedRoute, private emailService: EmailService, private manageuserService: ManageuserService) {
    super();
  }

  ngOnInit() {
    this.languages.forEach((e) => {
      this.model[e.locale] = new Email('', '', '');
      this.ck_error[e.locale] = true;
    });
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
      this.emailSub = this.emailService
        .getEmailById(this._id)
        .pipe(first())
        .subscribe(
          (response) => {
            const dataModel = {
              email_subject: '',
              email_body: '',
              template_purpose: '',
            };

            this.editCmsId = response.data[0].id || null;
            this.template_for = response.data[0].template_purpose || '';
            this.templateType = response.data[0].template_type || '';
            response.data.forEach((element) => {
              this.model[element.locale] = element;
            });

            this.languages.forEach((e) => {
              if (!this.model[e.locale] === undefined) {
                this.model[e.locale] = new Email('', '', '');
              }
            });
            if (this.templateType !== 'SMS') {
              this.config = this.CONSTANT.CKEditorConfig;
            }
          },
          (error) => {
            this.logger.error(error);
          }
        );
    }
  }
  /**
   * Create/Update Email template data
   */
  public onEmailSave() {
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    if (this.templateType !== 'SMS') {
      this.languages.forEach((element) => {
        if (this.ck_error[element.locale] === true) {
          return;
        }
      });
      // let c_error = false;
      // this.languages.forEach((element) => {
      //   if (this.model[element.locale].email_body.replace(/<[^>]*>/gi, '').length === 7) {
      //     c_error = true;
      //   }
      // });
      // if (c_error) {
      //   this.toastr.error('Please enter content');
      //   return;
      // }
    }
    const data = {
      translable: {},
      template_purpose: this.manageuserService.trimText(this.template_for),
    };
    this.languages.forEach((e) => {
      const obj = this.model[e.locale];
      obj['email_subject'] = this.manageuserService.trimText(obj['email_subject']);
      obj['email_body'] = this.manageuserService.trimText(obj['email_body']);
      data.translable[e.locale] = { ...obj };
    });
    if (this.editCmsId) {
      this.updateEmail(data, this.editCmsId);
    }
  }

  private updateEmail(formData, id) {
    this.loader.showLoader();
    this.emailSaveSub = this.emailService
      .updateEmail(formData, id)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status) {
            this.toastr.success(data.meta.message);
            this.router.navigate(['/email/list']);
          }
        },
        (error) => {
          this.errorHandler(this.toastr, this.translateService, error, () => {
            this.loader.hideLoader();
          });
        }
      );
  }

  getCKData(type, lan_direction) {
    if (lan_direction === 'LTR') {
      const a = this.model[type].email_body.substring(
        this.model[type].email_body.indexOf('<body>') + 6,
        this.model[type].email_body.indexOf('</body>')
      );
      this.ck_error[type] = a.length > 0 ? false : true;
    }
    if (lan_direction === 'RTL') {
      const a = this.model[type].email_body.substring(
        this.model[type].email_body.indexOf('<body dir="rtl">') + 16,
        this.model[type].email_body.indexOf('</body>')
      );
      this.ck_error[type] = a.length > 0 ? false : true;
    }
  }
}

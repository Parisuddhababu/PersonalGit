import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { BaseComponent } from '../../../_components/base.component';
import { AutoUnsubscribe } from '../../../_decorator/autounsubscribe';
import { Cms } from './../../../model/cms';
import { CmsService } from './../../../_services/cms.service';
@Component({
  selector: 'app-cms-add-edit',
  templateUrl: './cms-add-edit.component.html',
  styleUrls: ['./cms-add-edit.component.scss'],
})
@AutoUnsubscribe()
export class CmsAddEditComponent extends BaseComponent implements OnInit {
  @ViewChild('cmsFrm', { static: true }) form: any;

  private _id: number;
  editMode: Boolean = false;
  private editCmsId: number;
  model: any = new Cms({}, {}, {}, {});
  cmsStatus = this.statusEnum.active;
  ck_error = {};
  private routeSub: Subscription;
  private cmsSub: Subscription;
  private cmsSaveSub: Subscription;
  config = this.CONSTANT.CKEditorConfig;
  addEditCmsForm: FormGroup;
  buttonDisable = true;
  constructor(private route: ActivatedRoute, private cmsService: CmsService) {
    super();
  }

  ngOnInit() {
    this.languages.forEach((element) => {
      this.ck_error[element.locale] = true;
    });
    this.routeSub = this.route.params.subscribe((params) => {
      this._id = params['id'];
      this.editMode = params['id'] !== undefined;
      setTimeout(() => {
        // <<<---    using ()=> syntax
        this.initForm();
      }, 100);
    });
  }

  /**
   * Selected input value in edit mode
   */
  private initForm() {
    if (this.editMode) {
      this.cmsSub = this.cmsService
        .getCmsById(this._id)
        .pipe(first())
        .subscribe(
          (response) => {
            const resData = response.data;
            this.editCmsId = resData.id || null;
            this.cmsStatus = resData.status || this.statusEnum.active;
            resData.translations.forEach((element) => {
              this.model.page_title[element.locale] = element.page_title;
              this.model.description[element.locale] = element.description;
              this.model.meta_keywords[element.locale] = element.meta_keywords;
              this.model.meta_description[element.locale] = element.meta_description;
            });
          },
          (error) => {
            this.logger.error(error);
          }
        );
    }
  }
  /**
   * Create/Update CMS data
   */
  public onCmsSave() {
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    this.languages.forEach((element) => {
      if (this.ck_error[element.locale] === true) {
        return;
      }
    });
    this.getHtmlWithOutBodyTag();

    const formdata = new FormData();
    formdata.append('page_title', JSON.stringify(this.model.page_title));
    formdata.append('description', JSON.stringify(this.model.description));
    formdata.append('meta_keywords', JSON.stringify(this.model.meta_keywords));
    formdata.append('meta_description', JSON.stringify(this.model.meta_description));
    formdata.append('status', this.cmsStatus);

    if (this.editCmsId) {
      this.updateCms(formdata, this.editCmsId);
    } else {
      this.createCms(formdata);
    }
  }

  private createCms(formData) {
    this.loader.showLoader();
    this.cmsSaveSub = this.cmsService
      .createCms(formData)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status) {
            this.toastr.success(data.meta.message);
            this.router.navigate(['/cms/list']);
          }
        },
        (error) => {
          this.errorHandler(this.toastr, this.translateService, error, () => {
            this.loader.hideLoader();
          });
        }
      );
  }

  private updateCms(formData, id) {
    this.loader.showLoader();
    this.cmsSaveSub = this.cmsService
      .updateCms(formData, id)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status) {
            this.toastr.success(data.meta.message);
            this.router.navigate(['/cms/list']);
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
      const a = this.model.description[type].substring(
        this.model.description[type].indexOf('<body>') + 6,
        this.model.description[type].indexOf('</body>')
      );
      this.ck_error[type] = a.length > 0 ? false : true;
    }
    if (lan_direction === 'RTL') {
      const a = this.model.description[type].substring(
        this.model.description[type].indexOf('<body dir="rtl">') + 16,
        this.model.description[type].indexOf('</body>')
      );
      this.ck_error[type] = a.length > 0 ? false : true;
    }
  }
  getHtmlWithOutBodyTag() {
    for (const key in this.model.description) {
      if (this.model.description[key].indexOf('<body') !== -1 && this.model.description[key].indexOf('</body>') !== -1) {
        const text = this.model.description[key].substr(this.model.description[key].indexOf('<body') + 5);
        const text2 = text.substr(text.indexOf('>') + 1);
        const text3 = text2.substr(0, text2.indexOf('</body>'));
        this.model.description[key] = text3;
      }
    }
  }
}

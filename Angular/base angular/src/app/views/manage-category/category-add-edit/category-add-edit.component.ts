import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { BaseComponent } from '../../../_components/base.component';
import { AutoUnsubscribe } from '../../../_decorator/autounsubscribe';
import { CategoryService } from './../../../_services/category-service';

@Component({
  selector: 'app-category-add-edit',
  templateUrl: './category-add-edit.component.html',
  styleUrls: ['./category-add-edit.component.scss'],
})
@AutoUnsubscribe()
export class CategoryAddEditComponent extends BaseComponent implements OnInit {
  @ViewChild('catFrm', { static: true }) form: any;

  private _id: string;
  editMode = false;
  private editCategoryId: string;
  category_subject: string;
  category_body: string;
  topicListData: any;
  private routeSub: Subscription;
  private categorySub: Subscription;
  private categorySaveSub: Subscription;
  model = {
    name: {},
    description: {},
  };
  category_status = this.statusEnum.active;
  isOpen = false;
  addEditCmsForm: FormGroup;
  parent_category: any = { id: '', name: '' };
  parent_name: string;
  parent_id: number;
  parentCatList: any[] = [];
  private parentCategorySub: Subscription;
  constructor(private route: ActivatedRoute, private categoryService: CategoryService) {
    super();
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params) => {
      this._id = params['id'];
      this.editMode = params['id'] !== undefined;
      setTimeout(() => {
        this.initForm();
      }, 100);
    });
  }

  openTree() {
    this.isOpen = this.isOpen === true ? false : true;
  }
  /**
   * Selected input value in edit mode
   */
  private initForm() {
    if (this.editMode) {
      this.categorySub = this.categoryService
        .getCategoryById(this._id)
        .pipe(first())
        .subscribe(
          (response) => {
            const resData = response.data;
            this.editCategoryId = resData.uuid || null;
            this.category_status = resData.status || this.statusEnum.active;
            this.parent_name = resData.parent_name || '';
            this.parent_id = resData.parent_id === 0 ? '0' : resData.parent_id;
            resData.translatable.forEach((element) => {
              this.model.name[element.locale] = element.name;
              this.model.description[element.locale] = element.description;
            });
            this.getParentCategory(this._id);
          },
          (error) => {
            this.logger.error(error);
          }
        );
    } else {
      this.getParentCategory(0);
    }
  }
  /**
   * Create/Update Category data
   */
  public onCategorySave() {
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    if (Object.keys(this.model.description).length === 0) {
      this.languages.forEach((e) => {
        this.model.description[e.locale] = '';
      });
    }
    const data = {
      translable: this.model,
      parent_id: this.parent_category.id,
      status: this.category_status,
    };
    if (this.editCategoryId) {
      this.updateCategory(data, this.editCategoryId);
    } else {
      this.createCategory(data);
    }
  }

  private createCategory(formData) {
    this.loader.showLoader();
    this.categorySaveSub = this.categoryService
      .createCategory(formData)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status) {
            this.toastr.success(data.meta.message);
            this.router.navigate(['/category/list']);
          }
        },
        (error) => {
          this.errorHandler(this.toastr, this.translateService, error, () => {
            this.loader.hideLoader();
          });
        }
      );
  }

  private updateCategory(formData, id) {
    this.loader.showLoader();
    this.categorySaveSub = this.categoryService
      .updateCategory(formData, id)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status) {
            this.toastr.success(data.meta.message);
            this.router.navigate(['/category/list']);
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
   * Get parent category list
   * @param catId parent category id
   */
  private getParentCategory(catId) {
    this.parentCatList = [];
    const parentName = this.parent_name ? this.parent_name : '0';
    this.parentCategorySub = this.categoryService
      .getParentCategoryList(catId, parentName)
      .pipe(first())
      .subscribe(
        (data) => {
          const newValue = { id: '0', name: 'Select Category' };
          this.parentCatList = data.data;
          this.parentCatList.splice(0, 1, newValue);
          if (this._id) {
            // default selected
            this.parent_category = { id: this.parent_id, name: this.parent_name };
          } else {
            this.parent_category = this.parentCatList[0];
          }
        },
        (error) => { }
      );
  }
}

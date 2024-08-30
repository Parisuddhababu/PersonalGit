import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { BaseComponent } from '../../../_components/base.component';
import { CategoryService } from './../../../_services/category-service';

@Component({
  selector: 'app-category-treeview',
  templateUrl: './category-treeview.component.html',
  styleUrls: ['./category-treeview.component.scss'],
})
export class CategoryTreeviewComponent extends BaseComponent implements OnInit {
  roleLoading: Boolean = false;
  submitted: Boolean = false;
  allCategory: any[];
  private newArray: any = [];
  private finalArray: any[];
  options = {
    allowDrag: true,
    allowDrop: true,
  };
  private isPermissionSub: Boolean = false;

  constructor(private categoryService: CategoryService) {
    super();
  }

  ngOnInit() {
    this.getCategoryTreeData();
  }
  /**
   * Get category data in tree format
   */
  private getCategoryTreeData() {
    this.categoryService.getCategoryTreeview().subscribe((data) => {
      this.allCategory = data.data;
    });
  }

  onMoveNode(event) {
    this.logger.log(event);
  }

  private myFun(categoryDt, parentId) {
    const that = this;
    categoryDt.forEach(function (value, key) {
      that.newArray.push({ id: value.id, parent_id: parentId });
      if (value.children.length > 0) {
        that.myFun(value.children, value.id);
      }
    });
  }
  /**
   * Save category
   */
  public saveCategoryData() {
    this.myFun(this.allCategory, 0);
    const bodyData = {
      catData: this.newArray,
    };
    this.categoryService
      .saveCategoryTreeviewData(bodyData)
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.meta.status) {
            this.toastr.success(data.meta.message);
            this.router.navigate(['/category/treeview']);
          }
        },
        (error) => {
          this.errorHandler(this.toastr, this.translateService, error, () => {
            this.loader.hideLoader();
            this.submitted = false;
          });
        }
      );
  }
}

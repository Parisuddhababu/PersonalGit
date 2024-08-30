import { Component, OnInit, TemplateRef } from '@angular/core';
import { first } from 'rxjs/operators';
import { BaseComponent } from '../../../_components/base.component';
import { CategoryService } from './../../../_services/category-service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
})
export class CategoryListComponent extends BaseComponent implements OnInit {
  categoryList: any[] = [];
  global_search = '';
  private filteredData = [];
  private changeStatusId: number;
  private deleteCategoryId: number;
  private changeStatusType: string;
  private changedStatus: string;

  sortParam = '';
  sortOrder = '';
  pageNumber = 0;
  constructor(private categoryService: CategoryService) {
    super();
  }

  ngOnInit() {
    this.global_search = this.filterService.getSingleState('categoryFilter', this.global_search);
    this.size = this.filterService.getSingleState('categorySize', this.size);
    this.sortParam = this.filterService.getSingleState('categorySortParam', this.sortParam);
    this.sortOrder = this.filterService.getSingleState('categorySortOrder', this.sortOrder);
    this.pageNumber = this.filterService.getSingleState('categoryPageNo', this.pageNumber);
    this.getAllCategoryList();
  }
  /**
   * Sort datatable fields
   * @param event event was triggered, start sort sequence
   */
  public onSort(event) {
    this.sortParam = event.sorts[0].prop;
    this.sortOrder = event.sorts[0].dir;
    this.filterService.saveSingleState('categorySortParam', this.sortParam);
    this.filterService.saveSingleState('categorySortOrder', this.sortOrder);
  }
  /**
   * Populate the table with new data based on the page number
   * @param page The page to select
   */
  public setPage(pageInfo) {
    this.pageNumber = pageInfo.offset;
    this.filterService.saveSingleState('categoryPageNo', this.pageNumber);
  }
  /**
   * Show number of records in datatable
   * @param value show total entries value 10,25,50,100
   */
  public changeLimit(value) {
    this.size = value;
    this.filterService.saveSingleState('categorySize', this.size);
  }
  /**
   * Get Category list data
   */
  private getAllCategoryList(): void {
    this.loadingIndicator = true;
    this.categoryService
      .getAllCategoryList()
      .pipe(first())
      .subscribe(
        (data) => {
          this.loadingIndicator = false;
          if (!data.data) {
            this.categoryList = [];
          } else {
            this.categoryList = data.data;
            this.filteredData = data.data;
            this.filterDatatable();
          }
        },
        (err) => {
          this.loadingIndicator = false;
        }
      );
  }

  openModal(template: TemplateRef<any>, id, status) {
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
    this.changeStatusId = id;
    this.deleteCategoryId = id;
    this.changeStatusType = status;
  }

  decline(): void {
    this.modalRef.hide();
  }
  /**
   * Change Category status Active or Inactive
   */
  public changeStatus() {
    this.loader.showLoader();
    this.changedStatus = this.changeStatusType === this.statusEnum.active ? this.statusEnum.inactive : this.statusEnum.active;
    this.categoryService
      .changeCategoryStatus(this.changedStatus, this.changeStatusId)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status === true) {
            this.modalRef.hide();
            this.toastr.success(data.meta.message);
            this.rerender();
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
   * Delete Category
   */
  public deleteCategory() {
    this.loader.showLoader();
    this.categoryService
      .deleteCategory(this.deleteCategoryId)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status === true) {
            this.modalRef.hide();
            this.toastr.success(data.meta.message);
            this.rerender();
          }
        },
        (error) => {
          this.errorHandler(this.toastr, this.translateService, error, () => {
            this.loader.hideLoader();
          });
        }
      );
  }

  private rerender(): void {
    this.getAllCategoryList();
  }
  /**
   * Datatabe global search
   * @param event get search input value
   */
  public filterDatatable() {
    // const val = event.target.value.toLowerCase();
    const val = this.global_search.toLowerCase();
    // get the key names of each column in the dataset
    const keys = ['name', 'parent_name', 'status'];
    // assign filtered matches to the active datatable
    this.categoryList = this.filteredData.filter(function (item) {
      // iterate through each row's column data
      for (let i = 0; i < keys.length; i++) {
        // check for a match
        if ((item[keys[i]] && item[keys[i]].toString().toLowerCase().indexOf(val) !== -1) || !val) {
          // found match, return true to add to result set
          return true;
        }
      }
    });
    // whenever the filter changes, always go back to the first page
    // this.datatable.offset = 0;
    this.filterService.saveSingleState('categoryFilter', this.global_search);
  }
}

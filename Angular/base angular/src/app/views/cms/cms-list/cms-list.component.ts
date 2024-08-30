import { Component, OnInit, TemplateRef } from '@angular/core';
import { first } from 'rxjs/operators';
import { BaseComponent } from '../../../_components/base.component';
import { Cms } from './../../../model/cms';
import { CmsService } from './../../../_services/cms.service';

@Component({
  selector: 'app-cms-list',
  templateUrl: './cms-list.component.html',
  styleUrls: ['./cms-list.component.scss'],
})
export class CmsListComponent extends BaseComponent implements OnInit {
  cmsList: Cms[] = [];
  global_search = '';
  private filteredData = [];

  private changeStatusId: number;
  private changeStatusType: string;
  private changedStatus: string;

  pageNumber = 0;
  constructor(private cmsService: CmsService) {
    super();
  }

  ngOnInit() {
    console.clear();
    this.global_search = this.filterService.getSingleState('cmsFilter', this.global_search);
    this.size = this.filterService.getSingleState('cmsSize', this.size);
    this.sortParam = this.filterService.getSingleState('cmsSortParam', this.sortParam);
    this.sortOrder = this.filterService.getSingleState('cmsSortOrder', this.sortOrder);
    this.pageNumber = this.filterService.getSingleState('cmsPageNo', this.pageNumber);
    this.getAllCmsList();
  }
  /**
   * Sort datatable fields
   * @param event event was triggered, start sort sequence
   */
  public onSort(event) {
    this.sortParam = event.sorts[0].prop;
    this.sortOrder = event.sorts[0].dir;
    this.filterService.saveSingleState('cmsSortParam', this.sortParam);
    this.filterService.saveSingleState('cmsSortOrder', this.sortOrder);
  }
  /**
   * Populate the table with new data based on the page number
   * @param page The page to select
   */
  public setPage(pageInfo) {
    this.pageNumber = pageInfo.offset;
    this.filterService.saveSingleState('cmsPageNo', this.pageNumber);
  }
  /**
   * Show number of records in datatable
   * @param value show total entries value 10,25,50,100
   */
  public changeLimit(value) {
    this.size = value;
    this.filterService.saveSingleState('cmsSize', this.size);
  }
  /**
   * Get CMS list data
   */
  private getAllCmsList(): void {
    this.loadingIndicator = true;
    this.cmsService
      .getAllCmsList()
      .pipe(first())
      .subscribe(
        (data) => {
          this.loadingIndicator = false;
          if (!data.data) {
            this.cmsList = [];
          } else {
            this.cmsList = data.data;
            this.filteredData = data.data;
            this.filterDatatable();
          }
        },
        (err) => {
          this.loadingIndicator = false;
        }
      );
  }
  gotoPageBuilder(id, cms_page_name) {
    sessionStorage.setItem('cms_page_name', cms_page_name ? cms_page_name : '');
    this.router.navigate(['cms/page-builder/' + id]);
  }
  private rerender(): void {
    this.getAllCmsList();
  }
  openModal(template: TemplateRef<any>, id, status) {
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
    this.changeStatusId = id;
    this.changeStatusType = status;
  }

  confirm(): void {
    this.changeStatus(this.changeStatusId, this.changeStatusType);
  }

  decline(): void {
    this.modalRef.hide();
  }
  /**
   * Change CMS status Active or Inactive
   */
  public changeStatus(id, status) {
    this.loader.showLoader();
    this.changedStatus = status === this.statusEnum.active ? this.statusEnum.inactive : this.statusEnum.active;
    this.cmsService
      .changeCmsStatus(this.changedStatus, id)
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
   * Datatabe global search
   * @param event get search input value
   */
  public filterDatatable() {
    // const val = event.target.value.toLowerCase();
    const val = this.global_search.toLowerCase();
    // get the key names of each column in the dataset
    const keys = ['page_title', 'status'];
    // assign filtered matches to the active datatable
    this.cmsList = this.filteredData.filter(function (item) {
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
    this.filterService.saveSingleState('cmsFilter', this.global_search);
  }
}

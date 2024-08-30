import { Component, OnInit, TemplateRef } from '@angular/core';
import { first } from 'rxjs/operators';
import { BaseComponent } from '../../../_components/base.component';
import { Faq } from './../../../model/faq';
import { FaqService } from './../../../_services/faq-service';

@Component({
  selector: 'app-faq-list',
  templateUrl: './faq-list.component.html',
  styleUrls: ['./faq-list.component.scss'],
})
export class FaqListComponent extends BaseComponent implements OnInit {
  faqList: Faq[] = [];
  global_search = '';
  private filteredData = [];

  private changeStatusId: number;
  private deleteFaqId: number;
  private changeStatusType: string;
  private changedStatus: string;
  sortParam = '';
  sortOrder = '';
  pageNumber = 0;
  constructor(private faqService: FaqService) {
    super();
  }

  ngOnInit() {
    this.global_search = this.filterService.getSingleState('faqFilter', this.global_search);
    this.size = this.filterService.getSingleState('faqSize', this.size);
    this.sortParam = this.filterService.getSingleState('faqSortParam', this.sortParam);
    this.sortOrder = this.filterService.getSingleState('faqSortOrder', this.sortOrder);
    this.pageNumber = this.filterService.getSingleState('faqPageNo', this.pageNumber);
    this.getAllFaqList();
  }
  /**
   * Sort datatable fields
   * @param event event was triggered, start sort sequence
   */
  public onSort(event) {
    this.sortParam = event.sorts[0].prop;
    this.sortOrder = event.sorts[0].dir;
    this.filterService.saveSingleState('faqSortParam', this.sortParam);
    this.filterService.saveSingleState('faqSortOrder', this.sortOrder);
  }
  /**
   * Populate the table with new data based on the page number
   * @param page The page to select
   */
  public setPage(pageInfo) {
    this.pageNumber = pageInfo.offset;
    this.filterService.saveSingleState('faqPageNo', this.pageNumber);
  }
  /**
   * Show number of records in datatable
   * @param value show total entries value 10,25,50,100
   */
  public changeLimit(value) {
    this.size = value;
    this.filterService.saveSingleState('faqSize', this.size);
  }
  /**
   * Get FAQ list data
   */
  private getAllFaqList(): void {
    this.faqService
      .getAllFaqList()
      .pipe(first())
      .subscribe(
        (data) => {
          if (!data.data) {
            this.faqList = [];
          } else {
            this.faqList = this.getValueByKey(data, 'data.original.data', []);
            this.filteredData = this.getValueByKey(data, 'data.original.data', []);
            this.filterDatatable();
          }
        },
        (error) => {
          this.logger.error(error);
        }
      );
  }

  openModal(template: TemplateRef<any>, id, status) {
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
    this.changeStatusId = id;
    this.deleteFaqId = id;
    this.changeStatusType = status;
  }

  decline(): void {
    this.modalRef.hide();
  }
  /**
   * Change FAQ status Active or Inactive
   */
  public changeStatus() {
    this.loader.showLoader();
    this.changedStatus = this.changeStatusType === this.statusEnum.active ? this.statusEnum.inactive : this.statusEnum.active;
    this.faqService
      .changeFaqStatus(this.changedStatus, this.changeStatusId)
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
   * Delete FAQ
   */
  public deleteFAQ() {
    this.loader.showLoader();
    this.faqService
      .deleteFaq(this.deleteFaqId)
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
    this.getAllFaqList();
  }
  /**
   * Datatabe global search
   * @param event get search input value
   */
  public filterDatatable() {
    // const val = event.target.value.toLowerCase();
    const val = this.global_search.toLowerCase();
    // get the key names of each column in the dataset
    const keys = ['question', 'status'];
    // assign filtered matches to the active datatable
    this.faqList = this.filteredData.filter(function (item) {
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
    this.filterService.saveSingleState('faqFilter', this.global_search);
  }
}

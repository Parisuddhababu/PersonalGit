import { Component, OnInit, TemplateRef } from '@angular/core';
import { first } from 'rxjs/operators';
import { BaseComponent } from '../../../_components/base.component';
import { Email } from './../../../model/email';
import { getValueByKey } from './../../../utils/common';
import { EmailService } from './../../../_services/email-service';

@Component({
  selector: 'app-email-list',
  templateUrl: './email-list.component.html',
  styleUrls: ['./email-list.component.scss'],
})
export class EmailListComponent extends BaseComponent implements OnInit {
  emailList: Email[] = [];
  global_search = '';
  private filteredData = [];

  private changeStatusId: number;
  private changeStatusType: string;
  private changedStatus: string;
  sortParam = '';
  sortOrder = '';
  pageNumber = 0;
  constructor(private emailService: EmailService) {
    super();
  }

  ngOnInit() {
    this.global_search = this.filterService.getSingleState('emailFilter', this.global_search);
    this.size = this.filterService.getSingleState('emailSize', this.size);
    this.sortParam = this.filterService.getSingleState('emailSortParam', this.sortParam);
    this.sortOrder = this.filterService.getSingleState('emailSortOrder', this.sortOrder);
    this.pageNumber = this.filterService.getSingleState('emailPageNo', this.pageNumber);
    this.getAllEmailList();
  }
  /**
   * Sort datatable fields
   * @param event event was triggered, start sort sequence
   */
  public onSort(event) {
    this.sortParam = event.sorts[0].prop;
    this.sortOrder = event.sorts[0].dir;
    this.filterService.saveSingleState('emailSortParam', this.sortParam);
    this.filterService.saveSingleState('emailSortOrder', this.sortOrder);
  }
  /**
   * Populate the table with new data based on the page number
   * @param page The page to select
   */
  public setPage(pageInfo) {
    this.pageNumber = pageInfo.offset;
    this.filterService.saveSingleState('emailPageNo', this.pageNumber);
  }
  /**
   * Show number of records in datatable
   * @param value show total entries value 10,25,50,100
   */
  public changeLimit(value) {
    this.size = value;
    this.filterService.saveSingleState('emailSize', this.size);
  }
  /**
   * Get Email Template list data
   */
  private getAllEmailList(): void {
    this.loadingIndicator = true;
    this.emailService
      .getAllEmailList()
      .pipe(first())
      .subscribe(
        (data) => {
          this.loadingIndicator = false;
          if (!data.data) {
            this.emailList = [];
          } else {
            this.emailList = getValueByKey(data, 'data.original.data', []);
            this.filteredData = getValueByKey(data, 'data.original.data', []);
            this.filterDatatable();
          }
        },
        (error) => {
          this.loadingIndicator = false;
          this.logger.error(error);
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
    const keys = ['email_subject', 'status', 'template_purpose', 'template_type'];
    // assign filtered matches to the active datatable
    this.emailList = this.filteredData.filter(function (item) {
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
    this.filterService.saveSingleState('emailFilter', this.global_search);
  }

  openModal(template: TemplateRef<any>, id, status) {
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
    this.changeStatusId = id;
    this.changeStatusType = status;
  }

  decline(): void {
    this.modalRef.hide();
  }
  private rerender(): void {
    this.getAllEmailList();
  }
  /**
   * Change FAQ status Active or Inactive
   */
  public changeStatus() {
    this.loader.showLoader();
    this.changedStatus = this.changeStatusType === this.statusEnum.active ? this.statusEnum.inactive : this.statusEnum.active;
    this.emailService
      .changeEmailStatus(this.changedStatus, this.changeStatusId)
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
}

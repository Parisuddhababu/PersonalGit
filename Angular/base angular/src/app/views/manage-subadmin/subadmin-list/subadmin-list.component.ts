import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { BaseComponent } from '../../../_components/base.component';
import { ManageuserService } from '../../../_services/manageuser-service';
import { Subadmin } from './../../../model/subadmin';
import { SubadminService } from './../../../_services/subadmin-service';

@Component({
  selector: 'app-subadmin-list',
  templateUrl: './subadmin-list.component.html',
  styleUrls: ['./subadmin-list.component.scss'],
})
export class SubadminListComponent extends BaseComponent implements OnDestroy, OnInit {
  private activeRoleList: Subscription;
  subadminList: Subadmin[] = [];

  submitted = false;
  newpass: string;
  filter = this.defaultFilterData;
  departmentList = [];
  locationList = [];
  confirmpass: string;
  private subadmnID: number;
  private changeStatusType: string;
  private changedStatus: string;
  roleList: any;
  permissions: any[];
  conf_pass_match: String = '';
  showPass = false;
  showConfPass = false;

  constructor(private subadminService: SubadminService, private manageuserService: ManageuserService) {
    super();
    // For get filter, sorting, pagenumber and size in storage
    this.filter = this.filterService.getState('subadminFilter', this.filter);
    this.sortParam = this.filterService.getSingleState('subadminSortParam', this.sortParam);
    this.sortOrder = this.filterService.getSingleState('subadminSortOrder', this.sortOrder);
    this.pageNumber = this.filterService.getSingleState('subadminPageNo', this.pageNumber);
    this.size = this.filterService.getSingleState('subadminSize', this.size);
  }

  ngOnInit() {
    this.activeRoleList = this.subadminService
      .getActiveRoleList()
      .pipe(first())
      .subscribe(
        (response) => {
          this.roleList = response.data;
        },
        (error) => {
          this.logger.error(error);
        }
      );
    this.getAllSubadminList();
  }
  /**
   * Sort datatable fields
   * @param event event was triggered, start sort sequence
   */
  public onSort(event) {
    this.sortParam = event.sorts[0].prop;
    this.sortOrder = event.sorts[0].dir;
    this.rerender(false);
  }

  /**
   * Populate the table with new data based on the page number
   * @param page The page to select
   */
  public setPage(pageInfo) {
    this.pageNumber = pageInfo.offset;
    this.rerender(false);
  }
  /**
   * Show number of records in datatable
   * @param value show total entries value 10,25,50,100
   */
  public changeLimit(value) {
    this.size = value;
    this.rerender(true);
  }
  /**
   * Get Sub Admin list data
   */
  private getAllSubadminList() {
    this.loadingIndicator = true;
    // For save filter, sorting, pagenumber and size in storage
    this.filterService.saveState('subadminFilter', this.filter);
    this.filterService.saveSingleState('subadminSortParam', this.sortParam);
    this.filterService.saveSingleState('subadminSortOrder', this.sortOrder);
    this.filterService.saveSingleState('subadminPageNo', this.pageNumber);
    this.filterService.saveSingleState('subadminSize', this.size);
    this.subadminService
      .getAllSubadminList({
        name: this.filter.fullname,
        email: this.filter.email,
        status: this.filter.status,
        role: this.filter.role,
        start: this.pageNumber * this.size,
        length: this.size,
        sort_param: this.sortParam,
        sort_type: this.sortOrder,
      })
      .pipe(first())
      .subscribe(
        (resp) => {
          this.loadingIndicator = false;
          this.subadminList = resp.data['original'].data;
          this.totalReords = resp.data['original'].recordsTotal;
        },
        (err) => {
          this.loadingIndicator = false;
        }
      );
  }

  openModal(template: TemplateRef<any>, id, status) {
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
    this.subadmnID = id;
    this.changeStatusType = status;
    // For password change
    this.submitted = false;
    this.newpass = '';
    this.confirmpass = '';
    this.showPass = false;
    this.showConfPass = false;
  }

  decline(): void {
    this.modalRef.hide();
  }
  /**
   * Change Sub Admin status Active or Inactive
   */
  public changeStatus() {
    this.loader.showLoader();
    this.changedStatus = this.changeStatusType === this.statusEnum.active ? this.statusEnum.inactive : this.statusEnum.active;
    this.subadminService
      .changeSubadminStatus(this.changedStatus, this.subadmnID)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status === true) {
            this.decline();
            this.toastr.success(data.meta.message);
            this.rerender(false);
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
   * Delete Sub Admin
   */
  public deleteSubadmin() {
    this.loader.showLoader();
    this.subadminService
      .deleteSubadmin(this.subadmnID)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status === true) {
            this.decline();
            this.toastr.success(data.meta.message);
            this.rerender(false, true);
          }
        },
        (error) => {
          this.errorHandler(this.toastr, this.translateService, error, () => {
            this.loader.hideLoader();
          });
        }
      );
  }

  public searchApply() {
    this.rerender(true);
  }
  get defaultFilterData() {
    return {
      status: '',
      role: '',
      fullname: '',
      email: '',
    };
  }
  public resetSearch() {
    this.datatable.headerComponent.offsetX = 0;
    this.filter = this.defaultFilterData;
    this.rerender(true);
  }
  /**
   * Change Sub Admin Password
   * @param changePassFrm for password form validation
   */
  public changePassword(changePassFrm: NgForm) {
    this.submitted = true;
    if (changePassFrm.invalid) {
      return;
    }

    const data = {
      user_id: this.subadmnID,
      new_password: this.newpass,
      confirm_password: this.confirmpass,
    };
    this.loader.showLoader();
    this.subadminService
      .changeSubadminPassword(data)
      .pipe(first())
      .subscribe(
        (data_v) => {
          this.loader.hideLoader();
          if (data_v.meta.status === true) {
            this.decline();
            this.toastr.success(data_v.meta.message);
            this.newpass = '';
            this.confirmpass = '';
            this.submitted = false;
            this.rerender(false);
          }
        },
        (error) => {
          this.errorHandler(this.toastr, this.translateService, error, () => {
            this.loader.hideLoader();
            this.newpass = '';
            this.confirmpass = '';
            this.submitted = false;
          });
        }
      );
  }

  ngOnDestroy(): void {
    this.activeRoleList.unsubscribe();
  }
  /**
   * API call and refresh datatable value
   * @param goFirstPage set first page when param value true
   */
  rerender(goFirstPage, isDelete = false): void {
    if (goFirstPage) {
      this.pageNumber = 0;
    }
    // Pagination is lost and the panel moves back to the 1st page instead of staying on the same page when delete record
    if (isDelete && this.pageNumber && this.subadminList.length === 1) {
      this.pageNumber = this.pageNumber - 1;
    }
    this.getAllSubadminList();
  }
  checkPass() {
    this.conf_pass_match = this.manageuserService.checkPassword(this.newpass);
  }
}

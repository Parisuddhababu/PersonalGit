import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ExportFileType } from '../../../utils/common';
import { BaseComponent } from '../../../_components/base.component';
import { AutoUnsubscribe } from '../../../_decorator/autounsubscribe';
import { Manageuser } from './../../../model/manageuser';
import { ManageuserService } from './../../../_services/manageuser-service';

@Component({
  selector: 'app-manage-user-list',
  templateUrl: './manage-user-list.component.html',
  styleUrls: ['./manage-user-list.component.scss'],
})
@AutoUnsubscribe()
export class ManageUserListComponent extends BaseComponent implements OnInit {
  fileName = '';
  file = '';
  ManageuserList: Manageuser[] = [];

  submitted = false;
  newpass: string;
  filter = this.defaultFilterData;

  confirmpass: string;
  private userID: number;
  private changeStatusType: string;
  private changedStatus: string;
  conf_pass_match = '';
  showPass = false;
  showConfPass = false;
  constructor(private manageuserService: ManageuserService,
    private http: HttpClient) {
    super();
  }

  ngOnInit() {
    // For get filter, sorting, pagenumber and size in storage

    this.logger.info(`Init Called`);

    this.filter = this.filterService.getState('userFilter', this.filter);
    this.sortParam = this.filterService.getSingleState('userSortParam', this.sortParam);
    this.sortOrder = this.filterService.getSingleState('userSortOrder', this.sortOrder);
    this.pageNumber = this.filterService.getSingleState('userPageNo', this.pageNumber);
    this.size = this.filterService.getSingleState('userSize', this.size);

    this.logger.info(`Filter Initialized from localstorage`);

    this.getAllManageUserListURL();
  }
  get defaultFilterData() {
    return {
      status: '',
      gender: '',
      phone_number: '',
      fullname: '',
      email: '',
    };
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
  private get filterData() {
    return {
      name: this.filter.fullname,
      email: this.filter.email,
      status: this.filter.status,
      gender: this.filter.gender,
      phone_number: this.filter.phone_number,
      sort_param: this.sortParam,
      sort_type: this.sortOrder,
    };
  }
  /**
   * Get Users list data
   */
  private getAllManageUserListURL() {
    this.logger.info(`get List Of Users from API`);
    this.loadingIndicator = true;
    // For save filter, sorting, pagenumber and size in storage
    this.filterService.saveState('userFilter', this.filter);
    this.filterService.saveSingleState('userSortParam', this.sortParam);
    this.filterService.saveSingleState('userSortOrder', this.sortOrder);
    this.filterService.saveSingleState('userPageNo', this.pageNumber);
    this.filterService.saveSingleState('userSize', this.size);
    this.manageuserService
      .getAllManageUserListURL({
        ...this.filterData,
        start: this.pageNumber * this.size,
        length: this.size,
      })
      .pipe(first())
      .subscribe(
        (resp) => {
          this.logger.info(`get List of users from API:`, resp);
          this.loadingIndicator = false;
          this.ManageuserList = resp.data['original'].data;
          this.totalReords = resp.data['original'].recordsTotal;
        },
        (error) => {
          this.logger.error(error)
          this.logger.error(`List of users API failed:`, error);
          this.loadingIndicator = false;
        }
      );
  }

  /* Open any Modal Popup */
  openModal(template: TemplateRef<any>, id, status) {
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
    this.userID = id;
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
   * Change user status Active or Inactive
   */
  public changeStatus() {
    this.loader.showLoader();
    this.changedStatus = this.changeStatusType === this.statusEnum.active ? this.statusEnum.inactive : this.statusEnum.active;
    this.manageuserService
      .changeManageUserStatus(this.changedStatus, this.userID)
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
   * Delete user
   */
  public deleteManageUser() {
    this.loader.showLoader();
    this.manageuserService
      .deleteManageUser(this.userID)
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

  /**
   * Used to lock user for edit.
   *
   */
  public lockManageUser(id) {
    this.loader.showLoader();
    this.manageuserService
      .lockManageUser(id)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status === true) {
            this.rerender(false);
          }
        },
        (error) => {
          this.errorHandler(this.toastr, this.translateService, error, () => {
            this.loader.hideLoader();
            this.decline();
          });
        }
      );
  }

  /**
   * Unlock user for edit.
   *
   */
  public unlockManageUser() {
    this.loader.showLoader();
    this.manageuserService
      .unlockManageUser(this.userID, 0)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status === true) {
            this.decline();
            this.toastr.success(data.meta.message);
            this.rerender(true);
          }
        },
        (error) => {
          this.errorHandler(this.toastr, this.translateService, error, () => {
            this.loader.hideLoader();
            this.decline();
            this.getAllManageUserListURL();
          });
        }
      );
  }

  public searchApply() {
    this.rerender(true);
  }

  public resetSearch() {
    this.filter = this.defaultFilterData;
    this.rerender(true);
  }
  /**
   * Change User Password
   * @param changePassFrm for password form validation
   */
  public changePassword(changePassFrm: NgForm) {
    this.submitted = true;
    if (changePassFrm.invalid) {
      return;
    }

    const data = {
      user_id: this.userID,
      new_password: this.newpass,
      confirm_password: this.confirmpass,
    };
    this.loader.showLoader();
    this.manageuserService
      .changeManageUserPassword(data)
      .pipe(first())
      .subscribe(
        (d) => {
          this.loader.hideLoader();
          if (d.meta.status === true) {
            this.decline();
            this.toastr.success(d.meta.message);
            this.newpass = '';
            this.confirmpass = '';
            this.submitted = false;
            this.rerender(false);
          }
        },
        (error) => {
          this.errorHandler(this.toastr, this.translateService, error, () => {
            this.newpass = '';
            this.confirmpass = '';
            this.submitted = false;
            this.loader.hideLoader();
          });
        }
      );
  }
  checkPass() {
    this.conf_pass_match = this.manageuserService.checkPassword(this.newpass);
  }
  /**
   * API call and refresh datatable value
   * @param goFirstPage set first page when param value true
   */
  private rerender(goFirstPage, isDelete = false): void {
    if (goFirstPage) {
      this.pageNumber = 0;
    }
    // Pagination is lost and the panel moves back to the 1st page instead of staying on the same page when delete record
    if (isDelete && this.pageNumber && this.ManageuserList.length === 1) {
      this.pageNumber = this.pageNumber - 1;
    }
    this.getAllManageUserListURL();
  }
  downloadData(type) {
    this.loader.showLoader();
    this.manageuserService.getExportUserList(this.filterData, type).subscribe(
      (data) => {
        this.downloadSuccessHandler(this.http, this.toastr, this.translateService, data, () => {
          this.loader.hideLoader();
        }, ExportFileType.USER);
      },
      (error) => {
        // this.errorHandler(this.toastr, this.translateService, error, () => {
        //   this.loader.hideLoader();
        // });
      },
      () => this.logger.log('OK')
    );
  }

  downloadSampleFile(type) {
    this.loader.showLoader();
    this.manageuserService.getSampleUserImportFile().subscribe(
      (data) => {
        this.downloadSuccessHandler(this.http, this.toastr, this.translateService, data, () => {
          this.loader.hideLoader();
        }, ExportFileType.SAMPLE, 'sample_file_path', true);
      },
      (error) => {
        this.errorHandler(this.toastr, this.translateService, error, () => {
          this.loader.hideLoader();
        });
      },
      () => this.logger.log('OK')
    );
  }

  /**
   * Validate file
   * @param event get file array
   */
  public async changeFile(event: any) {
    if (event.target.files[0] !== undefined) {
      const fileTypes = ['application/vnd.ms-excel', 'text/csv'];
      if (fileTypes.includes(event.target.files[0].type) === false) {
        const message = await this.getTranslation('PLEASE_UPLOAD_VALID_FILE', 'CSV');
        this.toastr.error(message);
      } else {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.file = event.target.files[0];
          this.fileName = event.target.files[0].name;
        };
        reader.readAsDataURL(event.target.files[0]);
      }
    }
  }
  public openFile() {
    document.getElementById('importCSV').click();
  }
  importCSVFile() {
    const formData: FormData = new FormData();
    formData.append('file', this.file);
    this.loader.showLoader();
    this.manageuserService
      .importCSVFile(formData)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status) {
            this.toastr.success(data.meta.message);
            this.rerender(false);
            this.cancelImport();
          }
        },
        async (error) => {
          const errorData = error;
          if (errorData && errorData.meta) {
            if (errorData.meta.message_code === 'VALIDATION_ERROR') {
              for (const key in errorData.errors) {
                if (key) {
                  this.toastr.error(errorData.errors[key][0]);
                }
              }
            } else {
              this.toastr.error(errorData.meta.message);
            }
          } else {
            const message = await this.translateService.get('PLEASE_UPLOAD_VALID_CSV_FILE').toPromise();
            this.toastr.error(message);
          }
          this.loader.hideLoader();
        }
      );
  }
  cancelImport() {
    this.file = '';
    this.fileName = '';
  }
}

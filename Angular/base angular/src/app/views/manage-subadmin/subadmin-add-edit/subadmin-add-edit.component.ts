import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { BaseComponent } from '../../../_components/base.component';
import { AutoUnsubscribe } from '../../../_decorator/autounsubscribe';
import { ManageuserService } from '../../../_services/manageuser-service';
import { SubadminService } from './../../../_services/subadmin-service';

@Component({
  selector: 'app-subadmin-add-edit',
  templateUrl: './subadmin-add-edit.component.html',
  styleUrls: ['./subadmin-add-edit.component.scss'],
})
@AutoUnsubscribe()
export class SubadminAddEditComponent extends BaseComponent implements OnInit {
  @ViewChild('f', { static: true }) form: any;

  private _id: number;
  editMode = false;
  private editSubadminId: number;
  submitted: Boolean = false;
  subadmin_subject: string;
  subadmin_body: string;
  roleList: any;
  private routeSub: Subscription;
  private subadminSub: Subscription;
  private activeRoleList: Subscription;
  private subadminTopicList: Subscription;
  private subadminSaveSub: Subscription;
  model: any = [];
  role = '';
  roleValidation: String = 'Please select role';
  roleStatus: String = '';
  departmentList = [];
  locationList = [];
  showPass = false;
  showConfPass = false;
  constructor(private route: ActivatedRoute, private subadminService: SubadminService, private manageuserService: ManageuserService) {
    super();
  }

  ngOnInit() {
    this.model.department_id = '';
    this.model.location_id = '';
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
      this.subadminSub = this.subadminService
        .getSubadminById(this._id)
        .pipe(first())
        .subscribe(
          (response) => {
            this.editSubadminId = response.data.id || null;
            this.model.first_name = response.data.first_name || '';
            this.model.last_name = response.data.last_name || '';
            this.model.username = response.data.username || '';
            this.model.email = response.data.email || '';
            this.role = response.data.roles[0].id || '';
            this.roleStatus = response.data.roles[0].status || '';
            if (this.roleStatus && this.roleStatus === 'Inactive') {
              this.role = '';
              this.roleValidation = 'Your previous role is inactive, so select new role';
            }
          },
          (error) => {
            this.logger.error(error);
          }
        );
    }
  }
  /**
   * Create/Update Sub admin data
   * @param frm for validate form
   */
  public onSubadminSave(frm: NgForm) {
    this.submitted = true;
    // stop here if form is invalid
    if (frm.invalid) {
      return;
    }
    delete frm.value['confirm_pass'];
    if (this.editSubadminId) {
      delete frm.value['username'];
      this.updateSubadmin(frm.value, this.editSubadminId);
    } else {
      this.createSubadmin(frm.value);
    }
  }

  private createSubadmin(formData) {
    this.loader.showLoader();
    this.subadminSaveSub = this.subadminService
      .createSubadmin(formData)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status) {
            this.toastr.success(data.meta.message);
            this.router.navigate(['/subadmin/list']);
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

  private updateSubadmin(formData, id) {
    this.loader.showLoader();
    this.subadminSaveSub = this.subadminService
      .updateSubadmin(formData, id)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status) {
            this.toastr.success(data.meta.message);
            this.router.navigate(['/subadmin/list']);
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
  checkPass() {
    this.model.conf_pass_match = this.manageuserService.checkPassword(this.model.password);
  }
}

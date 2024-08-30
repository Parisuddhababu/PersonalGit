import { Component, OnInit } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { BaseComponent } from '../../_components/base.component';
import { ManageuserService } from '../../_services/manageuser-service';
import { AuthenticationService } from './../../_services/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent extends BaseComponent implements OnInit {
  resetPasswordForm: FormGroup;
  token = '';
  model: any = {};
  isDisplayForm: Boolean = true;
  showPass = false;
  showConfPass = false;
  constructor(
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private manageuserService: ManageuserService
  ) {
    super();
    this.token = this.route.snapshot.queryParams['t'] || this.route.snapshot.queryParams['token'];
  }

  ngOnInit() {
    this.model.conf_pass_match = '';
    this.validateResetPass();
  }

  validateResetPass() {
    this.authenticationService
      .validateResetPass(this.token)
      .pipe(first())
      .subscribe(
        async (data: any) => {
          if (data.meta.status) {
            this.isDisplayForm = true;
          } else {
            const message = await this.getTranslation('SOMETHING_WENT_WRONG');
            this.toastr.error(message);
          }
        },
        (error: any) => {
          this.errorHandler(this.toastr, this.translateService, error);
        }
      );
  }

  onSubmit(frm: NgForm) {
    // stop here if form is invalid
    if (frm.invalid) {
      return;
    }
    this.loader.showLoader();
    this.authenticationService
      .resetPass(this.token, this.model.password, this.model.cpassword)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status) {
            this.router.navigate(['login']);
            this.toastr.success(data.meta.message);
            frm.resetForm();
          }
        },
        (error) => {
          this.errorHandler(this.toastr, this.translateService, error, () => {
            this.loader.hideLoader();
          });
        }
      );
  }
  checkPass() {
    this.model.conf_pass_match = this.manageuserService.checkPassword(this.model.password);
  }
}

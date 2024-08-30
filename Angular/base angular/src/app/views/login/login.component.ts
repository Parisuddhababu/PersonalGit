import { Location } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { first } from 'rxjs/operators';
import { CONFIG } from '../../config/app-config';
import { BaseComponent } from '../../_components/base.component';
import Validator from '../../_validators/common.validator';
import { AuthenticationService } from './../../_services/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
})
export class LoginComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChild('forgotPassModal', { static: true }) public forgotPassModal: ModalDirective;
  loginForm: FormGroup;
  forgotPassWordForm: FormGroup;
  returnUrl: string;
  loading = false;
  forgotPassLoading = false;
  isForgotModalShown: Boolean = false;
  showPass = false;
  constructor(private authenticationService: AuthenticationService, private route: ActivatedRoute, private _location: Location) {
    super();
  }
  ngOnInit() {
    // login form
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
      rememberMe: new FormControl(),
    });
    const encrypted = localStorage.getItem('remData');
    const getRemData = this.EncrDecr.get(CONFIG.EncrDecrKey, encrypted);
    if (getRemData && getRemData !== 'null') {
      const parseData = JSON.parse(getRemData);
      this.loginForm.controls['email'].setValue(parseData.email);
      this.loginForm.controls['password'].setValue(parseData.pass);
      this.loginForm.controls['rememberMe'].setValue(parseData.rem);
    }
    // for auto sign up (please remove after start api integration)
    // author : Harsha Prajapati
    // date : 28-07-2020
    // this.loginForm.controls['email'].setValue('rahul.trivedi@brainvire.com');
    // this.loginForm.controls['password'].setValue('admin123');
    // this.onSubmit();
    // end

    // forgot password form
    this.forgotPassWordForm = new FormGroup({
      forgotPassemail: new FormControl(null, [Validators.required, Validator.emailValidator]),
    });

    // reset login status
    const decrypted = localStorage.getItem('currentUser');
    const currentUser = this.EncrDecr.get(CONFIG.EncrDecrKey, decrypted);
    if (currentUser) {
      this._location.back();
    } else {
      this.authenticationService.logout();

      // get return url from route parameters or default to '/'
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }
  }

  onSubmit() {
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.loader.showLoader();
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    const rememberMe = this.loginForm.value.rememberMe;
    this.authenticationService
      .login(email, password)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status) {
            if (rememberMe) {
              const rememberData = {
                email: email,
                pass: password,
                rem: rememberMe,
              };
              const encrypted = this.EncrDecr.set(CONFIG.EncrDecrKey, rememberData);
              localStorage.setItem('remData', encrypted);
            } else {
              localStorage.removeItem('remData');
            }
            this.authenticationService.setLoggedIn(true);
            this.toastr.success(data.meta.message);
            this.router.navigate([this.returnUrl]);
          }
        },
        (error) => {
          this.errorHandler(this.toastr, this.translateService, error, () => {
            this.loader.hideLoader();
            this.loading = false;
          });
        }
      );
  }

  ngAfterViewInit() {
    // Remove fixed sidebar and header classes from body
    document.querySelector('body').classList.remove('sidebar-fixed', 'aside-menu-fixed', 'sidebar-lg-show', 'header-fixed');
  }
  showForgotModal(): void {
    this.forgotPassWordForm.reset();
    this.isForgotModalShown = true;
  }
  hideForgotModal(): void {
    this.isForgotModalShown = false;
  }
  onForgotHidden(): void {
    this.isForgotModalShown = false;
  }
  forgotPassword() {
    // stop here if form is invalid
    if (this.forgotPassWordForm.invalid) {
      return;
    }
    this.forgotPassLoading = true;
    const forgotPassemail = this.forgotPassWordForm.value.forgotPassemail;
    this.authenticationService
      .forgotPassword(forgotPassemail)
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.meta.status) {
            this.forgotPassWordForm.reset();
            this.isForgotModalShown = false;
            this.forgotPassLoading = false;
            this.toastr.success(data.meta.message);
          }
        },
        (error) => {
          this.errorHandler(this.toastr, this.translateService, error, () => {
            this.loader.hideLoader();
            this.forgotPassLoading = false;
          });
        }
      );
  }
}

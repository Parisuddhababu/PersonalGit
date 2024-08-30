import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../../_services/authentication.service';
import { LoaderService } from '../../_services/loader.service';
import { ManageuserService } from '../../_services/manageuser-service';
import { CommonRegx } from '../../_validators/common.validator';
import { CONFIG } from './../../config/app-config';

@Component({
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  oldpass: string;
  newpass: string;
  confirmpass: string;
  password_submit: boolean;
  conf_pass_match = '';

  public CommonRegx = CommonRegx;
  showPass = false;
  showConfPass = false;
  showOldPass = false;
  constructor(
    private http: HttpClient,
    public router: Router,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService,
    private loader: LoaderService,
    private manageuserService: ManageuserService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.getProfileData();
  }
  /**
   * set input value of logged in user
   */
  private getProfileData() {
    this.http.get(CONFIG.getUserProfileIdURL).subscribe(
      (res) => {
        const profiledata = res['data'];
        this.firstname = profiledata.first_name;
        this.lastname = profiledata.last_name;
        this.username = profiledata.username;
        this.email = profiledata.email;
        localStorage.setItem('fullName', this.firstname + ' ' + this.lastname);
        document.getElementById('headerName').innerHTML = this.firstname + ' ' + this.lastname;
      },
      (msg) => console.error(`Error: Something went wrong,Please try again later`)
    );
  }
  /**
   * Update logged in user profile
   * @param frm validate form fields
   */
  public updateProfile(frm: NgForm) {
    if (frm.invalid) {
      return;
    }
    const data = {
      first_name: this.manageuserService.trimText(this.firstname),
      last_name: this.manageuserService.trimText(this.lastname),
    };
    this.http.put(CONFIG.updateProfileInfoURL, data).subscribe(
      (res) => {
        this.toastr.success(res['meta']['message'], '', {
          timeOut: 3000,
          closeButton: true,
        });
        this.getProfileData();
      },
      (msg) => {
        if (msg !== 'Unauthorized') {
          Object.keys(msg.errors).forEach((key) => {
            this.toastr.error(msg.errors[key], '', {
              timeOut: 3000,
              closeButton: true,
            });
          });
        }
      }
    );
  }
  /**
   * Change logged in user password
   * @param frm validate form fields
   */
  public async changePassword(frm: NgForm) {
    if (frm.invalid) {
      return;
    }
    if (this.oldpass === this.newpass) {
      const message = await this.translate.get('CURRENT_NEW_PASSWORD_NOT_SAME').toPromise();
      this.toastr.error(message);
      return false;
    }
    const data = {
      old_password: this.oldpass,
      new_password: this.newpass,
      confirm_password: this.confirmpass,
    };
    this.loader.showLoader();
    this.http.put(CONFIG.changeProfilePassURL, data).subscribe(
      (res) => {
        this.loader.hideLoader();
        if (res['meta']['status'] === true) {
          this.toastr.success(res['meta']['message']);
          this.authenticationService.logout();
          this.router.navigate(['/login']);
        } else {
          this.toastr.error(res['meta']['message']);
        }
      },
      async (msg) => {
        this.loader.hideLoader();
        if (msg['meta']['message_code'] === 'OLD_PASSWORD_NOT_MATCH') {
          this.toastr.error(msg['meta']['message']);
        } else {
          const message = await this.translate.get('SOMETHING_WENT_WRONG').toPromise();
          this.toastr.error(message);
        }
      }
    );
  }

  checkPass() {
    this.conf_pass_match = this.manageuserService.checkPassword(this.newpass);
  }
}

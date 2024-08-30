import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { CookieService } from 'ngx-cookie-service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { BaseComponent } from '../../../_components/base.component';
import { DownloadPdfService } from './../../../_services/download-pdf.service';
import { ManageuserService } from './../../../_services/manageuser-service';
@Component({
  selector: 'app-manage-user-add-edit',
  templateUrl: './manage-user-add-edit.component.html',
  styleUrls: ['./manage-user-add-edit.component.scss'],
})
export class ManageUserAddEditComponent extends BaseComponent implements OnInit, OnDestroy {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  gender: string;
  phone_number: number;
  date_of_birth: string;
  maxDate: any;
  url: String = this.noProfileImage;
  profile_image: string;
  noPicture: Boolean = false;

  @ViewChild('f', { static: true }) form: any;

  private _id: number;
  editMode = false;
  private editUserId: number;
  submitted: Boolean = false;
  private routeSub: Subscription;
  private userData: Subscription;
  private userDataSave: Subscription;
  model: any = [];
  imageChangedEvent: any = '';
  isRemoveAPI: Boolean = false;
  fileName: string;
  fileType: string;
  showPass = false;
  showConfPass = false;
  constructor(
    private route: ActivatedRoute,
    private manageuserservice: ManageuserService,
    private _eref: ElementRef,
    private ngbDateParserFormatter: NgbDateParserFormatter,
    private cookieService: CookieService,
    public downloadPdfService: DownloadPdfService
  ) {
    super();
    /* Set Maximum Date */
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate());
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params) => {
      this._id = params['id'];
      this.editMode = params['id'] !== undefined;
      setTimeout(() => {
        this.initForm();
      }, 100);
    });
  }

  /* Change and Upload Image in User Module */
  async changeImage(event: any) {
    const img = event;
    if (event.target.files[0] !== undefined) {
      const imgSize = this.CONSTANT.imageUpload.MAX_FILE_SIZE;
      let temp;
      const fileTypes = this.CONSTANT.imageUpload.ALLOW_FILE_TYPE;
      if (fileTypes.includes(event.target.files[0].type) === false) {
        const message = await this.getTranslation(this.CONSTANT.imageUpload.MESSAGE, this.CONSTANT.imageUpload.FILE);
        this.toastr.error(message);
      } else {
        if ((temp = imgSize) === void 0 || temp === '' || event.target.files[0].size / 1024 / 1024 < imgSize) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.noPicture = true;
            this.isRemoveAPI = false;
            this.fileName = img.target.files[0].name;
            this.fileType = img.target.files[0].type;
            this.imageChangedEvent = img;
          };
          reader.readAsDataURL(event.target.files[0]);
        } else {
          const message = await this.getTranslation('PLEASE_UPLOAD_IMAGE_MAXSIZE', imgSize);
          this.toastr.error(message);
        }
      }
    }
  }
  imageCropped(event: ImageCroppedEvent) {
    this.url = event.base64;
    this.model.cropped_image = event.file;
  }
  openImageUpload() {
    document.getElementById('profile_picture').click();
  }
  /* Remove Image in User Module */
  removePicture(upld_photo) {
    if (this.isRemoveAPI) {
      this.manageuserservice
        .deleteUserProfile(this.cookieService.get('get_id'))
        .pipe(first())
        .subscribe(
          (data) => {
            if (data.meta.status === true) {
              this.noPicture = false;
              upld_photo.value = null;
              this.url = this.noProfileImage;
            }
          },
          (error) => {
            this.errorHandler(this.toastr, this.translateService, error, () => {
              this.loader.hideLoader();
            });
          }
        );
    } else {
      this.noPicture = false;
      upld_photo.value = null;
      this.imageChangedEvent = '';
      this.url = this.noProfileImage;
    }
  }
  /**
   * Selected input value in edit mode
   */
  private initForm() {
    if (this.editMode) {
      /* Set the value to Cookies with Edit Mode */
      /* error TS2345:
       Argument of type 'number' is not assignable to parameter of type 'string'.
      */
      this.cookieService.set('get_id', '' + this._id + '');
      /* Set the value to Cookies with Edit Mode */
      this.userData = this.manageuserservice
        .getManagerUserById(this._id)
        .pipe(first())
        .subscribe(
          (response) => {
            this.editUserId = response.data.id || null;
            this.model.first_name = response.data.first_name || '';
            this.model.last_name = response.data.last_name || '';
            this.model.username = response.data.username || '';
            this.model.email = response.data.email || '';
            this.model.phone_number = response.data.phone_number || '';
            this.model.gender = response.data.gender || '';
            if (!response.data.date_of_birth || response.data.date_of_birth === '0000-00-00') {
              this.model.date_of_birth = '';
            } else {
              this.model.date_of_birth = moment(response.data.date_of_birth).format(this.momentDateFormat);
            }
            /* error - InvalidStateError: Failed to set the 'value' property on 'HTMLInputElement' */
            if (response.data.profile_image) {
              this.url = response.data.profile_photo;
              this.noPicture = true;
              this.isRemoveAPI = true;
            } else {
              this.url = this.noProfileImage;
            }
            /* error */
          },
          (error) => { }
        );
    } else {
      /* Set the value to Cookies without Edit Mode */
      this.cookieService.set('get_id', undefined);
      /* Set the value to Cookies without Edit Mode */
    }
  }
  /**
   * Create/Update user data
   * @param frm for validate form
   */
  public onUserDataSave(frm: NgForm) {
    this.submitted = true;
    // stop here if form is invalid
    if (frm.invalid) {
      return;
    }
    delete frm.value['confirm_pass'];
    /* FormData for pushing the code with Image URL */
    const formData: FormData = new FormData();
    formData.append('first_name', this.model.first_name);
    formData.append('last_name', this.model.last_name);
    formData.append('username', this.model.username);
    formData.append('date_of_birth', this.model.date_of_birth ? this.formatDate(this.model.date_of_birth) : '');
    formData.append('gender', this.model.gender);
    formData.append('phone_number', this.model.phone_number);

    const file = (<HTMLInputElement>document.getElementById('profile_picture')).files[0];

    if (file) {
      const convertfile = new File([this.model.cropped_image], this.fileName, { type: this.fileType });
      formData.append('profile_image', convertfile);
    }

    if (this.editUserId) {
      this.updateManageUser(formData, this.editUserId);
    } else {
      formData.append('email', this.model.email);
      formData.append('password', this.model.password);
      this.createManageUser(formData);
    }
  }

  private createManageUser(formData) {
    this.loader.showLoader();
    this.userDataSave = this.manageuserservice
      .createManageUser(formData)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status) {
            this.successHandler(this.toastr, data, () => {
              this.router.navigate(['/manage-user/list']);
            });
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

  private updateManageUser(formData, id) {
    this.loader.showLoader();
    this.userDataSave = this.manageuserservice
      .updateManageUser(formData, id)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status) {
            this.successHandler(this.toastr, data, () => {
              this.router.navigate(['/manage-user/list']);
            });
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

  private unlockManageUser(id, is_self_locked) {
    this.userDataSave = this.manageuserservice
      .unlockManageUser(id, is_self_locked)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status) {
            this.router.navigate(['/manage-user/list']);
          }
        },
        (error) => {
          this.loader.hideLoader();
          this.submitted = false;
          // this.errorHandler(this.toastr, this.translateService, error, () => {
          //   this.loader.hideLoader();
          //   this.submitted = false;
          // });
        }
      );
  }

  checkPass() {
    this.model.conf_pass_match = this.manageuserservice.checkPassword(this.model.password);
  }
  ngOnDestroy() {
    this.routeSub.unsubscribe();
    if (this.editMode) {
      this.unlockManageUser(this._id, 1);
      this.userData.unsubscribe();
    }
  }
  printPdf(ref) {
    this.loader.showLoader();
    this.downloadPdfService.downloadReadOnlyPdf(ref, `${this._id}.pdf`, true, () => {
      this.loader.hideLoader();
    });
  }
}

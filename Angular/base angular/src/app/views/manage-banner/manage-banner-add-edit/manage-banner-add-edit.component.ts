import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { BaseComponent } from '../../../_components/base.component';
import { AutoUnsubscribe } from '../../../_decorator/autounsubscribe';
import { ManageBannerService } from '../../../_services/manage-banner.service';

@Component({
  selector: 'app-manage-banner-add-edit',
  templateUrl: './manage-banner-add-edit.component.html',
  styleUrls: ['./manage-banner-add-edit.component.scss'],
})
@AutoUnsubscribe()
export class ManageBannerAddEditComponent extends BaseComponent implements OnInit {
  url: String = '';
  noPicture: Boolean = false;

  @ViewChild('f', { static: true }) form: any;

  private _id: number;
  editMode = false;
  private editBannerId: number;
  submitted: Boolean = false;
  private routeSub: Subscription;
  private bannerData: Subscription;
  private bannerDataSave: Subscription;
  model = {
    banner_image: '',
    banner_title: {},
    banner_status: this.statusEnum.active,
  };
  imageChangedEvent: any = '';
  isRemoveAPI: Boolean = false;
  constructor(
    private route: ActivatedRoute,
    private manageBannerService: ManageBannerService,
    private _eref: ElementRef,
    private cookieService: CookieService
  ) {
    super();
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
          reader.onload = (ev: any) => {
            const image = new Image();
            image.src = ev.target.result;
            image.onload = async () => {
              this.isRemoveAPI = false;
              this.imageChangedEvent = img;
              const banheight = image.height;
              const banwidth = image.width;
              if (banwidth >= 700 && banheight >= 400) {
                const ratio = (banwidth / banheight).toFixed(1);
                const heightSubset1 = (banwidth / 1.5).toFixed();
                const heightSubset2 = (banwidth / 1.6).toFixed();
                const heightSubset3 = (banwidth / 1.7).toFixed();
                const heightSubset4 = (banwidth / 1.8).toFixed();
                if (ratio >= '1.5' && ratio <= '1.8') {
                  this.noPicture = true;
                  this.url = ev.target.result;
                  this.model.banner_image = img.target.files[0];
                } else {
                  this.toastr.error(
                    `Image width is ${banwidth}px , the height of this image should be one of subset: [${heightSubset4}px, ${heightSubset3}px,${heightSubset2}px, ${heightSubset1}px]`
                  );
                }
              } else {
                const message = await this.getTranslation('MINIMUM_IMAGE_DIMENSION', '700px*400px');
                this.toastr.error(message);
              }
            };
          };
          reader.readAsDataURL(event.target.files[0]);
        } else {
          const message = await this.getTranslation('PLEASE_UPLOAD_IMAGE_MAXSIZE', imgSize);
          this.toastr.error(message);
        }
      }
    }
  }

  /* Remove Image in User Module */
  removePicture(upld_photo) {
    this.noPicture = false;
    upld_photo.value = null;
    this.model.banner_image = '';
    this.url = '';
  }
  openImageUpload() {
    document.getElementById('banner_picture').click();
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
      this.bannerData = this.manageBannerService
        .getManageBannerById(this._id)
        .pipe(first())
        .subscribe(
          (response) => {
            const resData = response.data;
            this.editBannerId = resData.uuid || null;
            this.model.banner_status = resData.status || '';
            this.model.banner_image = resData.banner_image || '';
            // resData.translations.forEach((element) => {
            //   this.model.banner_title[element.locale] = element.title;
            // });
            Object.keys(resData.title).forEach(e => {
              this.model.banner_title[e] = resData.title[e];
            });
            /* error - InvalidStateError: Failed to set the 'value' property on 'HTMLInputElement' */
            if (resData.banner_image) {
              this.url = resData.banner_image;
              this.noPicture = true;
              this.isRemoveAPI = true;
            } else {
              this.url = this.noProfileImage;
            }
            /* error */
          },
          (error) => {
            this.logger.error(error);
          }
        );
    } else {
      /* Set the value to Cookies without Edit Mode */
      this.cookieService.set('get_id', undefined);
      /* Set the value to Cookies without Edit Mode */
    }
  }

  /**
   * Create/Update banner data
   * @param frm for validate form
   */
  public onBannerDataSave(frm: NgForm) {
    this.submitted = true;
    // stop here if form is invalid
    if (frm.invalid) {
      return;
    }

    /* FormData for pushing the code with Image URL */
    const formData: FormData = new FormData();
    Object.keys(this.model.banner_title).forEach(e => {
      formData.append(`title[${e}]`, this.model.banner_title[e] || "");
    });
    formData.append('status', this.model.banner_status);

    const file = (<HTMLInputElement>document.getElementById('banner_picture')).files[0];

    if (file) {
      formData.append('banner_image', this.model.banner_image);
    }

    if (this.editBannerId) {
      this.updateManageBanner(formData, this.editBannerId);
    } else {
      this.createManageBanner(formData);
    }
  }

  private createManageBanner(formData) {
    this.loader.showLoader();
    this.bannerDataSave = this.manageBannerService
      .createManageBanner(formData)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status) {
            this.successHandler(this.toastr, data, () => {
              this.router.navigate(['/manage-banner/list']);
            });
          }
        },
        (error) => {
          this.errorHandler(this.toastr, this.translateService, error, () => {
            this.loader.hideLoader();
          });
          this.submitted = false;
        }
      );
  }

  private updateManageBanner(formData, id) {
    this.loader.showLoader();
    this.bannerDataSave = this.manageBannerService
      .updateManageBanner(formData, id)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status) {
            this.successHandler(this.toastr, data, () => {
              this.router.navigate(['/manage-banner/list']);
            });
          }
        },
        (error) => {
          this.errorHandler(this.toastr, this.translateService, error, () => {
            this.loader.hideLoader();
          });
          this.submitted = false;
        }
      );
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
/* ngModel so used NgForm */
import { NgForm } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown/multiselect.model';
/* First Operations in RXJS */
import { first } from 'rxjs/operators';
import { CONFIGCONSTANTS } from '../../config/app-constants';
import { BaseComponent } from '../../_components/base.component';
/* Settings Service for API configuration */
import { SettingsService } from './../../_services/settings-service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent extends BaseComponent implements OnInit {
  /* Type Defination */
  obj: any;
  logoURL: string;
  faviconURL: string;
  @ViewChild('f', { static: true }) form: any;
  private _logo_id: number;
  private _fav_id: number;
  noLogo = false;
  noFav = false;
  /* this is required as we are passing all the data in Model */
  model: any = [];
  settingsData: any = [];
  settingsDataSave: any = [];
  setOfSets = [];
  submitted = false; // this is used form validate
  ImageData: any;
  readonly hotjarSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'route_name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    noDataAvailablePlaceholderText: 'No Page Found',
    searchPlaceholderText: 'Search Page name',
  };
  hotjar_script: string;
  hot_jar_pages_name: any = [];
  hotjar_ids: any = [];

  public defaultLogo = 'assets/img/brand/angular_logo.png';
  public defaultFav = 'assets/img/brand/angular_logo_small.png';
  constructor(private settingsservice: SettingsService) {
    super();
  }

  ngOnInit() {
    this.model.upload_image = '';
    this.getSettingsData(); // Calling this function on loading page
    this.logoURL = this.defaultLogo;
    this.faviconURL = this.defaultFav;
  }

  public onErrorLogoFavicon(event: any, type) {
    if (type === 'logo') {
      event.target.src = this.defaultLogo;
    } else {
      event.target.src = this.defaultFav;
    }
  }
  /**
   * get API Response for binding to HTML
   */
  private getSettingsData() {
    this.getImageData(); // Getting Image Response and Bind the same
    this.settingsservice
      .getSettingsDataURL()
      .pipe(first())
      .subscribe(
        (data) => {
          this.settingsData = data.data;
          const that = this;
          if (this.settingsData.length > 0) {
            this.settingsData.forEach(function (value, index) {
              that.getValue(value.option_name, value.option_value, value.id);
            });
          }

          // hot jar pages enable display selected
          const addEnablePage = [];
          if (this.hotjar_ids) {
            this.hotjar_ids.forEach((result) => {
              const key = this.hot_jar_pages_name.findIndex((k) => k.id === result);
              if (key !== -1) {
                addEnablePage.push(this.hot_jar_pages_name[key]);
              }
            });
            this.model.hotjar_ids = addEnablePage;
          }
        },
        (error) => {
          this.logger.error(error);
        }
      );
  }
  /**
   * Get dynamic input value and set it
   * @param name site_name...
   * @param value get value by key name
   * @param id for logo and favicon
   */
  private getValue(name, value, id) {
    switch (name) {
      case 'site_name': {
        this.model.site_name = value;
        break;
      }
      case 'tag_line': {
        this.model.tag_line = value;
        break;
      }
      case 'default_language': {
        this.model.default_language = value;
        break;
      }
      case 'support_email': {
        this.model.support_email = value;
        break;
      }
      case 'contact_email': {
        this.model.contact_email = value;
        break;
      }
      case 'contact_number': {
        this.model.contact_number = value;
        break;
      }
      case 'address': {
        this.model.address = value;
        break;
      }
      case 'allow_multiple_login': {
        this.model.multiple_login = value === 'true' ? true : false;
        break;
      }
      case 'enquiry_email_alert': {
        this.model.enquiry_email = value === 'true' ? true : false;
        break;
      }
      case 'activity_logs': {
        this.model.activity_logs = value === 'ON' ? true : false;
        break;
      }
      case 'auto_block_user': {
        this.model.auto_block_user = value === 'true' ? true : false;
        break;
      }
      case 'abuse_threshold': {
        this.model.abuse_threshold = value;
        break;
      }
      case 'device_tracking': {
        this.model.device_tracking = value;
        break;
      }
      case 'fb_pixel_code': {
        this.model.fb_pixel_code = value;
        break;
      }
      case 'google_tag': {
        this.model.google_tag = value;
        break;
      }
      case 'upload_image': {
        this.model.upload_image = value;
        break;
      }
      case 'hotjar_script': {
        this.model.hotjar_script = value;
        break;
      }
      case 'hot_jar_pages_name': {
        this.hot_jar_pages_name = value;
        break;
      }
      case 'ids': {
        this.hotjar_ids = value.split(',');
        break;
      }
      case 'logo': {
        this._logo_id = id;
        localStorage.setItem('logo_id_value', JSON.stringify(this._logo_id));
        break;
      }
      case 'favicon': {
        this._fav_id = id;
        /* store value as string in localstorage for remove function */
        localStorage.setItem('fav_id_value', JSON.stringify(this._fav_id));
        break;
      }
      default: {
        this.logger.error('Invalid choice');
        break;
      }
    }
  }
  /**
   * Update settings
   * @param frm for validate form data
   */
  public onSettingsDataSave(frm: NgForm) {
    this.submitted = true;
    if (frm.invalid) {
      return;
    }
    /* FormData for pushing the code with Image URL */
    const formData: FormData = new FormData();
    formData.append('site_name', this.model.site_name);
    formData.append('tag_line', this.model.tag_line);
    formData.append('default_language', this.model.default_language);
    formData.append('support_email', this.model.support_email);
    formData.append('contact_email', this.model.contact_email);
    formData.append('contact_number', this.model.contact_number);
    formData.append('address', this.model.address);
    formData.append('allow_multiple_login', this.model.multiple_login);
    formData.append('enquiry_email_alert', this.model.enquiry_email);
    formData.append('activity_logs', this.model.activity_logs === true ? 'ON' : 'OFF');
    formData.append('auto_block_user', this.model.auto_block_user);
    formData.append('abuse_threshold', this.model.abuse_threshold);
    formData.append('device_tracking', this.model.device_tracking);
    formData.append('fb_pixel_code', this.model.fb_pixel_code);
    formData.append('google_tag', this.model.google_tag);
    formData.append('upload_image', this.model.upload_image);
    formData.append('hotjar_script', this.model.hotjar_script);

    /* Hot Jar Enable Pages ID */
    const enablePagesArray = this.model.hotjar_ids.map((ele) => ele.id);
    if (enablePagesArray.length > 0) {
      formData.append('ids', enablePagesArray.toString());
    } else {
      formData.append('ids', '');
    }
    /* Get Logo file */
    const fileLOGO = (<HTMLInputElement>document.getElementById('profile_logo')).files[0];
    /* Get Favicon file */
    const fileFAV = (<HTMLInputElement>document.getElementById('profile_favicon')).files[0];

    /* Check Logo & Favicon file */
    if (fileLOGO) {
      formData.append('logo', fileLOGO);
    }
    if (fileFAV) {
      formData.append('favicon', fileFAV);
    }

    /* Call Update function */
    this.updateSettingsData(formData);
  }

  /* Update Method */
  private updateSettingsData(formData) {
    this.loader.showLoader();
    this.settingsDataSave = this.settingsservice
      .updateSettingsDataURL(formData)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status) {
            this.successHandler(this.toastr, data, () => {
              this.getSettingsData();
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

  /**
   * Get Image Data from API
   */
  private getImageData() {
    this.settingsservice
      .getSettingsImageDataURL()
      .pipe(first())
      .subscribe((data) => {
        this.ImageData = data.data;
        const sitename = data.data.site_name ? data.data.site_name : CONFIGCONSTANTS.siteName;
        if (data.data.logo) {
          this.logoURL = data.data.logo;
          this.noLogo = true;
        }
        if (data.data.favicon) {
          this.faviconURL = data.data.favicon;
          this.noFav = true;
          this.settingsservice.changeFavicon(data.data.favicon32);
        }
        this.settingsservice.setSettingsData(sitename, this.logoURL, this.faviconURL);
      });
  }

  /**
   * Validate image and Change Logo Image
   * @param event get image array
   */
  public async changeLogoImage(event: any) {
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
            this.noLogo = true;
            this.logoURL = e.target.result;
          };
          reader.readAsDataURL(event.target.files[0]);
        } else {
          const message = await this.getTranslation('PLEASE_UPLOAD_IMAGE_MAXSIZE', imgSize);
          this.toastr.error(message);
        }
      }
    }
  }
  public openLogoUpload() {
    document.getElementById('profile_logo').click();
  }
  /* remove logo */
  public removeLogoPicture(profile_logo) {
    /* convert string value to number type */
    const logo_id_value = localStorage.getItem('logo_id_value') ? JSON.parse(localStorage.getItem('logo_id_value')) : '';
    this.settingsservice
      .removeImage(logo_id_value)
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.meta.status === true) {
            this.logoURL = this.defaultLogo;
            profile_logo.value = null;
            this.noLogo = false;
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
   * Validate image and Change Favicon Image
   * @param event get image array
   */
  public async changeFavImage(event: any) {
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
            this.noFav = true;
            this.faviconURL = e.target.result;
          };
          reader.readAsDataURL(event.target.files[0]);
        } else {
          const message = await this.getTranslation('PLEASE_UPLOAD_IMAGE_MAXSIZE', imgSize);
          this.toastr.error(message);
        }
      }
    }
  }

  public openFavUpload() {
    document.getElementById('profile_favicon').click();
  }

  /* remove favicon */
  public removeFavPicture(profile_favicon) {
    /* convert string value to number type */
    const fav_id_value = localStorage.getItem('fav_id_value') ? JSON.parse(localStorage.getItem('fav_id_value')) : '';
    this.settingsservice
      .removeImage(fav_id_value)
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.meta.status === true) {
            this.faviconURL = this.defaultFav;
            profile_favicon.value = null;
            this.noFav = false;
            this.settingsservice.changeFavicon(this.defaultFav);
          }
        },
        (error) => {
          this.errorHandler(this.toastr, this.translateService, error, () => { });
        }
      );
  }
}

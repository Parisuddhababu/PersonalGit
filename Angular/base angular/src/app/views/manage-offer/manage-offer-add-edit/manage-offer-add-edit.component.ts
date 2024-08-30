import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { IDropdownSettings } from 'ng-multiselect-dropdown/multiselect.model';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { BaseComponent } from '../../../_components/base.component';
import { AutoUnsubscribe } from '../../../_decorator/autounsubscribe';
import { ManageOfferService } from '../../../_services/manage-offer.service';

@Component({
  selector: 'app-manage-offer-add-edit',
  templateUrl: './manage-offer-add-edit.component.html',
  styleUrls: ['./manage-offer-add-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
@AutoUnsubscribe()
export class ManageOfferAddEditComponent extends BaseComponent implements OnInit {
  @ViewChild('offerFrm', { static: true }) form: any;

  private offerData: Subscription;
  routeSub: Subscription;
  private _id: number;
  editMode = false;
  model: any = [];
  minDate: any;
  private editOfferId: number;
  private offerDataSave: Subscription;

  public userList: any[] = [];
  readonly userSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'username',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 4,
    allowSearchFilter: true,
    noDataAvailablePlaceholderText: 'No User Found',
    searchPlaceholderText: 'Search User',
  };
  constructor(private route: ActivatedRoute, private manageOfferService: ManageOfferService, private cd: ChangeDetectorRef) {
    super();
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
  }

  ngOnInit() {
    this.model.offer_type = '0';
    this.routeSub = this.route.params.subscribe((params) => {
      this._id = params['id'];
      this.editMode = params['id'] !== undefined;
      setTimeout(() => {
        this.initForm();
      }, 100);
    });
    this.getActiveUser();
  }

  private initForm() {
    if (this.editMode) {
      this.offerData = this.manageOfferService
        .getManageOfferById(this._id)
        .pipe(first())
        .subscribe(
          (response) => {
            this.editOfferId = response.data.uuid || null;
            const resData = response.data;
            this.model.offer_name = resData.name || '';
            this.model.offer_code = resData.code || '';
            this.model.offer_type = resData.type || '';
            this.model.offer_value = resData.value || '';
            this.model.offer_usage = resData.usage || '';
            this.model.user_ids = resData.users;
            if (!resData.start_dt || resData.start_dt === '0000-00-00') {
              this.model.start_date = '';
            } else {
              this.model.start_date = moment(resData.start_dt).format('MM/DD/YYYY');
            }
            if (!resData.end_dt || resData.end_dt === '0000-00-00') {
              this.model.end_date = '';
            } else {
              this.model.end_date = moment(resData.end_dt).format('MM/DD/YYYY');
            }
            this.model.applicable = resData.applicable || '';
          },
          (error) => {
            this.logger.error(error);
          }
        );
    }
  }
  maxEndDate(date) {
    if (date) {
      const dt = new Date(date);
      dt.setDate(dt.getDate() + 1);
      return dt;
    }
  }
  /**
   * For User List
   */
  getActiveUser() {
    this.manageOfferService
      .getActiveUser()
      .pipe(first())
      .subscribe(
        (resp) => {
          this.userList = [...resp.data];
        },
        (error) => {
          this.userList = [];
        }
      );
  }
  /**
   * For add and Edit Offer Save Click
   */
  async onOfferSave() {
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    if (Date.parse(this.model.start_date) >= Date.parse(this.model.end_date)) {
      const message = await this.getTranslation('END_DATE_GREATER_THEN_START_DATE');
      this.toastr.error(message);
      return;
    }
    const reqData = {
      name: this.model.offer_name,
      code: this.model.offer_code,
      type: this.model.offer_type,
      value: this.model.offer_value ? parseInt(this.model.offer_value, 10) : '',
      start_dt: this.model.start_date ? this.formatDate(this.model.start_date) : '',
      end_dt: this.model.end_date ? this.formatDate(this.model.end_date) : '',
      applicable: this.model.applicable,
      usage: this.model.offer_usage,
      users: this.model.applicable === '1' ? this.model.user_ids.map((ele) => ele.id).toString() : '',
    };
    if (this.editOfferId) {
      this.updateManageOffer(reqData, this.editOfferId);
    } else {
      this.createOffer(reqData);
    }
  }

  /**
   * for Create Api call with Parameters
   * @param reqData
   */
  createOffer(reqData) {
    this.loader.showLoader();
    this.manageOfferService
      .createManageOffer(reqData)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status) {
            this.toastr.success(data.meta.message);
            this.router.navigate(['/manage-offer/list']);
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
   * for Update Api call with Parameters
   * @param reqData
   * @param id
   */
  updateManageOffer(reqData, id) {
    this.loader.showLoader();
    this.offerDataSave = this.manageOfferService
      .updateManageOffer(reqData, id)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status) {
            this.toastr.success(data.meta.message);
            this.router.navigate(['/manage-offer/list']);
          }
        },
        (error) => {
          this.errorHandler(this.toastr, this.translateService, error, () => {
            this.loader.hideLoader();
          });
        }
      );
  }
  onchange() {
    this.cd.detectChanges();
  }
}

import { Component, ElementRef, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { subscriptionTrialPlan, subscriptionTrialPlanValue, subscriptionValidity } from '../../../utils/enum-const';
import { BaseComponent } from '../../../_components/base.component';
import { AutoUnsubscribe } from '../../../_decorator/autounsubscribe';
import { ManageSubscriptionService } from '../../../_services/manage-subscription.service';

@Component({
  selector: 'app-subscription-add-edit',
  templateUrl: './subscription-add-edit.component.html',
  styleUrls: ['./subscription-add-edit.component.scss'],
})
@AutoUnsubscribe()
export class SubscriptionAddEditComponent extends BaseComponent implements OnInit {
  plan_name: string;
  description: string;
  selected_days: any;
  validity = '';
  plan_price = '';
  plan_discount = '';
  trial_plan_type = subscriptionTrialPlan;
  trialEnum = subscriptionTrialPlanValue;
  planValidity = subscriptionValidity;
  private _id: number;
  editMode = false;
  private editSubscriptionId: number;
  submitted: Boolean = false;
  private routeSub: Subscription;
  private subscriptionData: Subscription;
  private subscriptionDataSave: Subscription;
  model: any = [];
  minDate: any;

  constructor(
    private route: ActivatedRoute,
    private manageSubscriptionService: ManageSubscriptionService,
    private _eref: ElementRef,
    private ngbDateParserFormatter: NgbDateParserFormatter,
    private cookieService: CookieService
  ) {
    super();
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
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

  /**
   * Selected input value in edit mode
   */
  private initForm() {
    if (this.editMode) {
      /* Set the value to Cookies with Edit Mode */
      this.subscriptionData = this.manageSubscriptionService
        .getManagerSubscriptionById(this._id)
        .pipe(first())
        .subscribe(
          (response) => {
            this.editSubscriptionId = response.data.uuid || null;
            this.model.plan_name = response.data.name || '';
            this.model.description = response.data.description || '';
            this.selected_days = [new Date(response.data.start_date), new Date(response.data.end_date)] || '';
            this.minDate = new Date(response.data.start_date);
            this.validity = response.data.validity || '';
            this.plan_price = response.data.price || '';
            this.plan_discount = response.data.discount || '';
            this.model.is_trial_plan = response.data.is_trial_plan || '';
          },
          (error) => {
            this.logger.error(error);
          }
        );
    }
  }

  /**
   * Create/Update subscription data
   * @param frm for validate form
   */
  public onSubscriptionDataSave(frm: NgForm) {
    this.submitted = true;
    // stop here if form is invalid
    if (frm.invalid) {
      return;
    }
    const reqData = {
      name: this.model.plan_name,
      validity: this.validity,
      description: this.model.description,
      start_date: this.selected_days ? this.formatDate(this.selected_days[0]) : '',
      end_date: this.selected_days ? this.formatDate(this.selected_days[1]) : '',
      is_trial_plan: this.model.is_trial_plan,
      price: this.model.is_trial_plan === this.trialEnum.yes ? 0 : Number(this.plan_price),
      discount: this.model.is_trial_plan === this.trialEnum.yes ? 0 : Number(this.plan_discount),
    };

    if ((!reqData.discount) || (reqData.discount && reqData.discount <= 0)) {
      delete reqData.discount;
    }

    if ((!reqData.price) || (reqData.price && reqData.price <= 0)) {
      delete reqData.price;
    }

    if (this.editSubscriptionId) {
      this.updateManageSubscription(reqData, this.editSubscriptionId);
    } else {
      this.createManageSubscription(reqData);
    }
  }

  private createManageSubscription(formData) {
    this.loader.showLoader();
    this.subscriptionDataSave = this.manageSubscriptionService
      .createManageSubscription(formData)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status) {
            this.toastr.success(data.meta.message);
            this.router.navigate(['/manage-subscription/list']);
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

  private updateManageSubscription(formData, id) {
    this.loader.showLoader();
    this.subscriptionDataSave = this.manageSubscriptionService
      .updateManageSubscription(formData, id)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status) {
            this.toastr.success(data.meta.message);
            this.router.navigate(['/manage-subscription/list']);
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
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { CONFIGCONSTANTS } from '../../../config/app-constants';
import { subscriptionTrialPlan, subscriptionValidity } from '../../../utils/enum-const';
import { ManageSubscriptionService } from '../../../_services/manage-subscription.service';

@Component({
  selector: 'app-subscription-view',
  templateUrl: './subscription-view.component.html',
  styleUrls: ['./subscription-view.component.scss'],
})
export class SubscriptionViewComponent implements OnInit {
  model: any = {};
  private _id: number;
  editMode = false;
  private editSubscriptionId: number;
  submitted = false;
  private routeSub: Subscription;
  momentDateTime24Format: string;
  momentDateFormat = CONFIGCONSTANTS.momentDateFormat || 'MM/DD/YYYY';
  noData = '-';
  plan_validity = subscriptionValidity;
  trial_plan_type = subscriptionTrialPlan;

  constructor(private route: ActivatedRoute, private manageSubscriptionService: ManageSubscriptionService) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params) => {
      this._id = params['id'];
      this.editMode = params['id'] !== undefined;
      setTimeout(() => {
        this.initForm();
      }, 1000);
    });
    this.momentDateTime24Format = CONFIGCONSTANTS.momentDateTime24Format || 'MM/DD/YYYY hh:mm:ss';
  }

  /**
   * Selected input value in edit mode
   */
  initForm() {
    if (this.editMode) {
      this.manageSubscriptionService
        .getManagerSubscriptionById(this._id)
        .pipe(first())
        .subscribe((response) => {
          this.editSubscriptionId = response.data.uuid || null;
          this.model.plan_name = response.data.name || '';
          this.model.description = response.data.description || '';
          this.model.validity = response.data.validity || '';
          this.model.price = response.data.price || '';
          this.model.start_date = response.data.start_date || '';
          this.model.end_date = response.data.end_date || '';
          this.model.discount = response.data.discount || '';
          this.model.is_trial_plan = response.data.is_trial_plan || '';
        });
    }
  }
}

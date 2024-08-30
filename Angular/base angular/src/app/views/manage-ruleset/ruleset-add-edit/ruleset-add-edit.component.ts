import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { BaseComponent } from '../../../_components/base.component';
import { AutoUnsubscribe } from '../../../_decorator/autounsubscribe';
import { RulesetService } from '../../../_services/ruleset.service';

@Component({
  selector: 'app-ruleset-add-edit',
  templateUrl: './ruleset-add-edit.component.html',
  styleUrls: ['./ruleset-add-edit.component.scss'],
})
@AutoUnsubscribe()
export class RulesetAddEditComponent extends BaseComponent implements OnInit {
  private _id: string;
  editMode = false;
  private editRuleId: number;
  private routeSub: Subscription;
  private ruleSub: Subscription;
  private ruleSaveSub: Subscription;
  model: any = {};
  filterList = [];
  constructor(private route: ActivatedRoute, private rulesetService: RulesetService) {
    super();
  }

  ngOnInit() {
    this.model.priority = '1';
    this.model.on_action = '';
    this.routeSub = this.route.params.subscribe((params) => {
      this._id = params['id'];
      this.editMode = params['id'] !== undefined;
      setTimeout(() => {
        this.initForm();
      }, 100);
    });
    this.addMoreFilter();
  }
  // Add more filter
  addMoreFilter(): void {
    let $filter_length = this.filterList.length;
    this.filterList.push({
      filter_no: `filter_${++$filter_length}`,
      item_name: 'email',
      verb_descritpion: 'CONTAINS',
      specified_input: '',
      time_frame: '',
      action: 'NOTHING',
      notification: 'NOTIFY',
    });
  }
  /**
   *
   * @param $f_no is an Filter no
   * it's an unique
   */
  removeFilter($f_no: string) {
    this.filterList.map((filt: any, i) => {
      if (filt.filter_no === $f_no) {
        this.filterList.splice(i, 1);
      }
    });
  }
  /**
   * Selected input value in edit mode
   */
  private initForm() {
    if (this.editMode) {
      this.ruleSub = this.rulesetService
        .getRulesetById({ id: this._id })
        .pipe(first())
        .subscribe(
          (response) => {
            const resData = response.data;
            this.editRuleId = resData.uuid || null;
            this.model.rulename = resData.name || '';
            this.model.description = resData.description || '';
            this.model.priority = resData.priority;
            this.model.on_action = resData.on_action;
            this.filterList = resData.filters ? JSON.parse(resData.filters) : [];
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
  public onRulesetSave(frm: NgForm) {
    // stop here if form is invalid
    if (frm.invalid) {
      return;
    }
    const reqData = {
      name: this.model.rulename,
      description: this.model.description,
      priority: this.model.priority,
      on_action: this.model.on_action,
      filters: JSON.stringify(this.filterList),
    };
    if (this.editRuleId) {
      reqData['id'] = this.editRuleId;
      this.updateRuleset(reqData);
    } else {
      this.createRuleset(reqData);
    }
  }

  private createRuleset(formData) {
    this.loader.showLoader();
    this.ruleSaveSub = this.rulesetService
      .createRuleset(formData)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status) {
            this.successHandler(this.toastr, data, () => {
              this.router.navigate(['/rulesets/list']);
            });
          }
        },
        (error) => {
          this.errorHandler(this.toastr, this.translateService, error, () => {
            this.loader.hideLoader();
          });
        }
      );
  }

  private updateRuleset(formData) {
    this.loader.showLoader();
    this.ruleSaveSub = this.rulesetService
      .updateRuleset(formData)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status) {
            this.successHandler(this.toastr, data, () => {
              this.router.navigate(['/rulesets/list']);
            });
          }
        },
        (error) => {
          this.errorHandler(this.toastr, this.translateService, error, () => {
            this.loader.hideLoader();
          });
        }
      );
  }
}

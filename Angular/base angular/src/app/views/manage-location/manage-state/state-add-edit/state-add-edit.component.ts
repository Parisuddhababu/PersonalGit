import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { BaseComponent } from '../../../../_components/base.component';
import { AutoUnsubscribe } from '../../../../_decorator/autounsubscribe';
import { LocationService } from '../../../../_services/location.service';

@Component({
  selector: 'app-state-add-edit',
  templateUrl: './state-add-edit.component.html',
  styleUrls: ['./state-add-edit.component.scss'],
})
@AutoUnsubscribe()
export class StateAddEditComponent extends BaseComponent implements OnInit {
  countryList = [];
  private _id: number;
  editMode = false;
  editStateId: number;
  routeSub: Subscription;
  stateSub: Subscription;
  stateSaveSub: Subscription;
  model: any = {
    countryId: '',
    stateName: {},
    stateCode: '',
    status: 'Active',
  };
  constructor(private route: ActivatedRoute, private locationService: LocationService) {
    super();
  }

  ngOnInit() {
    this.getCountryList();
    this.routeSub = this.route.params.subscribe((params) => {
      this._id = params['id'];
      this.editMode = params['id'] !== undefined;
      setTimeout(() => {
        this.initForm();
      }, 100);
    });
  }
  getCountryList() {
    this.locationService
      .getActiveCountry()
      .pipe(first())
      .subscribe(
        (response) => {
          this.countryList = response.data;
        },
        (error) => {
          this.logger.error(error);
        }
      );
  }
  initForm() {
    if (this.editMode) {
      this.stateSub = this.locationService
        .getStateById(this._id)
        .pipe(first())
        .subscribe((response) => {
          const resData = response.data;
          this.editStateId = resData.uuid || null;
          this.model.countryId = resData.country_id || '';
          this.model.stateCode = resData.state_code || '';
          this.model.status = resData.status || 'Active';
          resData.translations.forEach((element) => {
            this.model.stateName[element.locale] = element.name;
          });
        });
    }
  }
  onStateSave(frm: NgForm) {
    // stop here if form is invalid
    if (frm.invalid) {
      return;
    }
    const data = {
      country_id: this.model.countryId,
      name: this.model.stateName,
      state_code: this.model.stateCode,
      status: this.model.status,
    };
    if (this.editStateId) {
      this.updateState(data, this.editStateId);
    } else {
      this.createState(data);
    }
  }

  createState(formData) {
    this.loader.showLoader();
    this.stateSaveSub = this.locationService
      .createState(formData)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status) {
            this.toastr.success(data.meta.message);
            this.router.navigate(['/location/state']);
          }
        },
        (error) => {
          this.errorHandler(this.toastr, this.translateService, error, () => {
            this.loader.hideLoader();
          });
        }
      );
  }

  updateState(formData, id) {
    this.loader.showLoader();
    this.stateSaveSub = this.locationService
      .updateState(formData, id)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status) {
            this.toastr.success(data.meta.message);
            this.router.navigate(['/location/state']);
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

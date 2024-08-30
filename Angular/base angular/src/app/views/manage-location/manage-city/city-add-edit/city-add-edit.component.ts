import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { BaseComponent } from '../../../../_components/base.component';
import { AutoUnsubscribe } from '../../../../_decorator/autounsubscribe';
import { LocationService } from '../../../../_services/location.service';

@Component({
  selector: 'app-city-add-edit',
  templateUrl: './city-add-edit.component.html',
  styleUrls: ['./city-add-edit.component.scss'],
})
@AutoUnsubscribe()
export class CityAddEditComponent extends BaseComponent implements OnInit {
  stateList = [];
  private _id: number;
  editMode = false;
  editCityId: number;
  routeSub: Subscription;
  citySub: Subscription;
  citySaveSub: Subscription;
  model: any = {
    countryId: '',
    stateId: '',
    cityName: {},
    status: this.statusEnum.active,
  };
  countryList = [];
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
  getStateList() {
    this.locationService
      .getActiveState(this.model.countryId)
      .pipe(first())
      .subscribe(
        (response) => {
          this.stateList = response.data;
        },
        (error) => {
          this.logger.error(error);
        }
      );
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
      this.citySub = this.locationService
        .getCityById(this._id)
        .pipe(first())
        .subscribe((response) => {
          const resData = response.data;
          this.editCityId = resData.uuid || null;
          this.model.countryId = resData.country_id || '';
          this.model.stateId = resData.state_id || '';
          this.model.status = resData.status || this.statusEnum.active;
          resData.translations.forEach((element) => {
            this.model.cityName[element.locale] = element.name;
          });
          this.getStateList();
        });
    }
  }
  onCitySave(frm: NgForm) {
    // stop here if form is invalid
    if (frm.invalid) {
      return;
    }
    const data = {
      country_id: this.model.countryId,
      state_id: this.model.stateId,
      name: this.model.cityName,
      status: this.model.status,
    };
    if (this.editCityId) {
      this.updateCity(data, this.editCityId);
    } else {
      this.createCity(data);
    }
  }

  createCity(formData) {
    this.loader.showLoader();
    this.citySaveSub = this.locationService
      .createCity(formData)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status) {
            this.toastr.success(data.meta.message);
            this.router.navigate(['/location/city']);
          }
        },
        (error) => {
          this.errorHandler(this.toastr, this.translateService, error, () => {
            this.loader.hideLoader();
          });
        }
      );
  }

  updateCity(formData, id) {
    this.loader.showLoader();
    this.citySaveSub = this.locationService
      .updateCity(formData, id)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status) {
            this.toastr.success(data.meta.message);
            this.router.navigate(['/location/city']);
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

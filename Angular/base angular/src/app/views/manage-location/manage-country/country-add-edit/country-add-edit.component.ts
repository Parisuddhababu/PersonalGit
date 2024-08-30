import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { BaseComponent } from '../../../../_components/base.component';
import { AutoUnsubscribe } from '../../../../_decorator/autounsubscribe';
import { LocationService } from '../../../../_services/location.service';

@Component({
  selector: 'app-country-add-edit',
  templateUrl: './country-add-edit.component.html',
  styleUrls: ['./country-add-edit.component.scss'],
})
@AutoUnsubscribe()
export class CountryAddEditComponent extends BaseComponent implements OnInit {
  private _id: number;
  editMode = false;
  editCountryId: number;
  routeSub: Subscription;
  countrySub: Subscription;
  countrySaveSub: Subscription;
  model: any = {
    countryName: {},
    countryCode: '',
    status: this.statusEnum.active,
  };
  constructor(private route: ActivatedRoute, private locationService: LocationService) {
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
  initForm() {
    if (this.editMode) {
      this.countrySub = this.locationService
        .getCountryById(this._id)
        .pipe(first())
        .subscribe((response) => {
          const resData = response.data;
          this.editCountryId = response.data.uuid || null;
          this.model.countryCode = response.data.country_code || '';
          this.model.status = response.data.status || this.statusEnum.active;
          resData.translations.forEach((element) => {
            this.model.countryName[element.locale] = element.name;
          });
        });
    }
  }

  onCountrySave(frm: NgForm) {
    // stop here if form is invalid
    if (frm.invalid) {
      return;
    }
    const data = {
      name: this.model.countryName,
      country_code: this.model.countryCode,
      status: this.model.status,
    };
    if (this.editCountryId) {
      this.updateCountry(data, this.editCountryId);
    } else {
      this.createCountry(data);
    }
  }

  createCountry(formData) {
    this.loader.showLoader();
    this.countrySaveSub = this.locationService
      .createCountry(formData)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status) {
            this.toastr.success(data.meta.message);
            this.router.navigate(['/location/country']);
          }
        },
        (error) => {
          this.errorHandler(this.toastr, this.translateService, error, () => {
            this.loader.hideLoader();
          });
        }
      );
  }

  updateCountry(formData, id) {
    this.loader.showLoader();
    this.countrySaveSub = this.locationService
      .updateCountry(formData, id)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status) {
            this.toastr.success(data.meta.message);
            this.router.navigate(['/location/country']);
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

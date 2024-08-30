import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageLocationRoutingModule } from './manage-location-routing.module';
import { ManageLocationComponent } from './manage-location.component';
import { ManageCountryComponent } from './manage-country/manage-country.component';
import { ManageStateComponent } from './manage-state/manage-state.component';
import { ManageCityComponent } from './manage-city/manage-city.component';
import { CountryAddEditComponent } from './manage-country/country-add-edit/country-add-edit.component';
import { StateAddEditComponent } from './manage-state/state-add-edit/state-add-edit.component';
import { CityAddEditComponent } from './manage-city/city-add-edit/city-add-edit.component';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoaderModule } from '../../containers';
import { SharedModule } from '../../_module/shared.module';

@NgModule({
  declarations: [
    ManageLocationComponent,
    ManageCountryComponent,
    ManageStateComponent,
    ManageCityComponent,
    CountryAddEditComponent,
    StateAddEditComponent,
    CityAddEditComponent,
  ],
  imports: [
    CommonModule,
    ManageLocationRoutingModule,
    FormsModule,
    NgxDatatableModule,
    NgxPermissionsModule,
    NgbModule,
    LoaderModule,
    SharedModule,
  ],
})
export class ManageLocationModule {}

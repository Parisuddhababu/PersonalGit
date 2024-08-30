import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CityAddEditComponent } from './manage-city/city-add-edit/city-add-edit.component';
import { ManageCityComponent } from './manage-city/manage-city.component';
import { CountryAddEditComponent } from './manage-country/country-add-edit/country-add-edit.component';
import { ManageCountryComponent } from './manage-country/manage-country.component';
import { ManageLocationComponent } from './manage-location.component';
import { ManageStateComponent } from './manage-state/manage-state.component';
import { StateAddEditComponent } from './manage-state/state-add-edit/state-add-edit.component';

const routes: Routes = [
  {
    path: '',
    component: ManageLocationComponent,
    data: {
      title: 'MANAGE_LOCATION',
    },
    children: [
      {
        path: '',
        redirectTo: 'country',
      },
      {
        path: 'country',
        component: ManageCountryComponent,
        data: {
          title: 'MANAGE_COUNTRY',
          permission: 'COUNTRY_LIST',
        },
      },
      {
        path: 'country/add',
        component: CountryAddEditComponent,
        data: {
          title: 'ADD_COUNTRY',
          permission: 'COUNTRY_CREATE',
        },
      },
      {
        path: 'country/edit/:id',
        component: CountryAddEditComponent,
        data: {
          title: 'EDIT_COUNTRY',
          permission: 'COUNTRY_UPDATE',
        },
      },
      {
        path: 'state',
        component: ManageStateComponent,
        data: {
          title: 'MANAGE_STATE',
          permission: 'STATE_LIST',
        },
      },
      {
        path: 'state/add',
        component: StateAddEditComponent,
        data: {
          title: 'ADD_STATE',
          permission: 'STATE_CREATE',
        },
      },
      {
        path: 'state/edit/:id',
        component: StateAddEditComponent,
        data: {
          title: 'EDIT_STATE',
          permission: 'STATE_UPDATE',
        },
      },
      {
        path: 'city',
        component: ManageCityComponent,
        data: {
          title: 'MANAGE_CITY',
          permission: 'CITY_LIST',
        },
      },
      {
        path: 'city/add',
        component: CityAddEditComponent,
        data: {
          title: 'ADD_CITY',
          permission: 'CITY_CREATE',
        },
      },
      {
        path: 'city/edit/:id',
        component: CityAddEditComponent,
        data: {
          title: 'EDIT_CITY',
          permission: 'CITY_UPDATE',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageLocationRoutingModule {}

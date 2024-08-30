import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageOfferAddEditComponent } from './manage-offer-add-edit/manage-offer-add-edit.component';
import { ManageOfferListComponent } from './manage-offer-list/manage-offer-list.component';
import { ManageOfferComponent } from './manage-offer.component';

const routes: Routes = [
  {
    path: '',
    component: ManageOfferComponent,
    data: {
      title: 'MANAGE_OFFER',
    },
    children: [
      {
        path: 'add',
        component: ManageOfferAddEditComponent,
        data: {
          title: 'ADD_OFFER',
          permission: 'OFFER_CREATE',
        },
      },
      {
        path: 'edit/:id',
        component: ManageOfferAddEditComponent,
        data: {
          title: 'EDIT_OFFER',
          permission: 'OFFER_UPDATE',
        },
      },
      {
        path: 'list',
        component: ManageOfferListComponent,
        data: {
          title: 'OFFER_LIST',
          permission: 'OFFER_LIST',
        },
      },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageOfferRoutingModule {}

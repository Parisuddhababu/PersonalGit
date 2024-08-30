import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageSubscriptionComponent } from './manage-subscription.component';
import { SubscriptionAddEditComponent } from './subscription-add-edit/subscription-add-edit.component';
import { SubscriptionListComponent } from './subscription-list/subscription-list.component';
import { SubscriptionViewComponent } from './subscription-view/subscription-view.component';

const routes: Routes = [
  {
    path: '',
    component: ManageSubscriptionComponent,
    data: {
      title: 'MANAGE_SUBSCRIPTION',
    },
    children: [
      {
        path: 'add',
        component: SubscriptionAddEditComponent,
        data: {
          title: 'ADD_SUBSCRIPTION',
          permission: 'SUBSCRIPTION_CREATE',
        },
      },
      {
        path: 'edit/:id',
        component: SubscriptionAddEditComponent,
        data: {
          title: 'EDIT_SUBSCRIPTION',
          permission: 'SUBSCRIPTION_UPDATE',
        },
      },
      {
        path: 'view/:id',
        component: SubscriptionViewComponent,
        data: {
          title: 'VIEW_SUBSCRIPTION',
          permission: 'SUBSCRIPTION_VIEW',
        },
      },
      {
        path: 'list',
        component: SubscriptionListComponent,
        data: {
          title: 'SUBSCRIPTION_LIST',
          permission: 'SUBSCRIPTION_LIST',
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
export class ManageSubscriptionRoutingModule {}

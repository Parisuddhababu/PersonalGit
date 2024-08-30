import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageContactListComponent } from './manage-contact-list/manage-contact-list.component';
import { ManageContactComponent } from './manage-contact.component';

const routes: Routes = [
  {
    path: '',
    component: ManageContactComponent,
    data: {
      title: 'MANAGE_CONTACT',
    },
    children: [
      {
        path: 'list',
        component: ManageContactListComponent,
        data: {
          title: 'CONTACT_LIST',
          permission: 'CONTACT_LIST',
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
export class ManageContactRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubadminAddEditComponent } from './subadmin-add-edit/subadmin-add-edit.component';
import { SubadminListComponent } from './subadmin-list/subadmin-list.component';
import { SubadminComponent } from './subadmin.component';

const routes: Routes = [
  {
    path: '',
    component: SubadminComponent,
    data: {
      title: 'MANAGE_SUB_ADMIN',
    },
    children: [
      {
        path: 'add',
        component: SubadminAddEditComponent,
        data: {
          title: 'ADD_SUB_ADMIN',
          permission: 'SUB_ADMIN_CREATE',
        },
      },
      {
        path: 'edit/:id',
        component: SubadminAddEditComponent,
        data: {
          title: 'EDIT_SUB_ADMIN',
          permission: 'SUB_ADMIN_UPDATE',
        },
      },
      {
        path: 'list',
        component: SubadminListComponent,
        data: {
          title: 'SUB_ADMIN_LIST',
          permission: 'SUB_ADMIN_LIST',
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
export class SubadminRoutingModule {}

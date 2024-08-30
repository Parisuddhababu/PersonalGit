import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageUserAddEditComponent } from './manage-user-add-edit/manage-user-add-edit.component';
import { ManageUserListComponent } from './manage-user-list/manage-user-list.component';
import { ManageUserViewComponent } from './manage-user-view/manage-user-view.component';
import { ManageUserComponent } from './manage-user.component';

const routes: Routes = [
  {
    path: '',
    component: ManageUserComponent,
    data: {
      title: 'MANAGE_USER',
    },
    children: [
      {
        path: 'add',
        component: ManageUserAddEditComponent,
        data: {
          title: 'ADD_USER',
          permission: 'USER_CREATE',
        },
      },
      {
        path: 'edit/:id',
        component: ManageUserAddEditComponent,
        data: {
          title: 'EDIT_USER',
          permission: 'USER_UPDATE',
        },
      },
      {
        path: 'view/:id',
        component: ManageUserViewComponent,
        data: {
          title: 'VIEW_USER',
          permission: 'USER_VIEW',
        },
      },
      {
        path: 'list',
        component: ManageUserListComponent,
        data: {
          title: 'USERS_LIST',
          permission: 'USER_LIST',
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
export class ManageUserRoutingModule {}

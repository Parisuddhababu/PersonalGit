import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageBannerAddEditComponent } from './manage-banner-add-edit/manage-banner-add-edit.component';
import { ManageBannerListComponent } from './manage-banner-list/manage-banner-list.component';
import { ManageBannerComponent } from './manage-banner.component';

const routes: Routes = [
  {
    path: '',
    component: ManageBannerComponent,
    data: {
      title: 'MANAGE_BANNER',
    },
    children: [
      {
        path: 'add',
        component: ManageBannerAddEditComponent,
        data: {
          title: 'ADD_BANNER',
          permission: 'BANNER_CREATE',
        },
      },
      {
        path: 'edit/:id',
        component: ManageBannerAddEditComponent,
        data: {
          title: 'EDIT_BANNER',
          permission: 'BANNER_UPDATE',
        },
      },
      {
        path: 'list',
        component: ManageBannerListComponent,
        data: {
          title: 'BANNER_LIST',
          permission: 'BANNER_LIST',
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
export class ManageBannerRoutingModule {}

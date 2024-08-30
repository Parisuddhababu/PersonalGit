import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnnouncementAddEditComponent } from './announcement-add-edit/announcement-add-edit.component';
import { AnnouncementDetailsComponent } from './announcement-details/announcement-details.component';
import { AnnouncementListComponent } from './announcement-list/announcement-list.component';
import { AnnouncementComponent } from './announcement.component';

const routes: Routes = [
  {
    path: '',
    component: AnnouncementComponent,
    data: {
      title: 'ANNOUNCEMENT',
    },
    children: [
      {
        path: 'list',
        component: AnnouncementListComponent,
        data: {
          title: 'ANNOUNCEMENT_LIST',
          permission: 'MANAGE_ANNOUNCEMENT_LIST',
        },
      },
      {
        path: 'add',
        component: AnnouncementAddEditComponent,
        data: {
          title: 'ADD_ANNOUNCEMENT',
          permission: 'MANAGE_ANNOUNCEMENT_CREATE',
        },
      },
      {
        path: 'view/:id',
        component: AnnouncementDetailsComponent,
        data: {
          title: 'VIEW_ANNOUNCEMENT',
          permission: 'MANAGE_ANNOUNCEMENT_VIEW',
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
export class AnnouncementRoutingModule {}

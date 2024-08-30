import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventAddEditComponent } from './event-add-edit/event-add-edit.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventViewComponent } from './event-view/event-view.component';
import { ManageEventComponent } from './manage-event.component';

const routes: Routes = [
  {
    path: '',
    component: ManageEventComponent,
    data: {
      title: 'MANAGE_EVENT',
    },
    children: [
      {
        path: 'add',
        component: EventAddEditComponent,
        data: {
          title: 'ADD_EVENT',
          permission: 'EVENT_CREATE',
        },
      },
      {
        path: 'edit/:id',
        component: EventAddEditComponent,
        data: {
          title: 'EDIT_EVENT',
          permission: 'EVENT_UPDATE',
        },
      },
      {
        path: 'view/:id',
        component: EventViewComponent,
        data: {
          title: 'VIEW_EVENT',
          permission: 'EVENT_VIEW',
        },
      },
      {
        path: 'list',
        component: EventListComponent,
        data: {
          title: 'EVENT_LIST',
          permission: 'EVENT_LIST',
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
export class ManageEventRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivityTrackingComponent } from './activity-tracking.component';
import { ListActivityTrackingComponent } from './list-activity-tracking/list-activity-tracking.component';

const routes: Routes = [
  {
    path: '',
    component: ActivityTrackingComponent,
    data: {
      title: 'ACTIVITY_TRACKING',
    },
    children: [
      {
        path: 'list',
        component: ListActivityTrackingComponent,
        data: {
          title: 'ACTIVITY_TRACKING_LIST',
          permission: 'ACTIVITY_TRACKING_LIST',
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
export class ActivityTrackingRoutingModule {}

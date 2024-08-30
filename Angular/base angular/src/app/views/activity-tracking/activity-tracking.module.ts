import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivityTrackingRoutingModule } from './activity-tracking-routing.module';
import { ActivityTrackingComponent } from './activity-tracking.component';
import { ListActivityTrackingComponent } from './list-activity-tracking/list-activity-tracking.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoaderModule } from '../../containers';
import { SharedModule } from '../../_module/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [ActivityTrackingComponent, ListActivityTrackingComponent],
  imports: [
    CommonModule,
    ActivityTrackingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    NgxPermissionsModule,
    NgbModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    LoaderModule,
    SharedModule,
    BsDatepickerModule.forRoot(),
  ],
})
export class ActivityTrackingModule {}

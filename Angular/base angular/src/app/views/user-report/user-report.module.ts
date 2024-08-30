import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserReportRoutingModule } from './user-report-routing.module';
import { UserReportComponent } from './user-report.component';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxPermissionsModule } from 'ngx-permissions';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { LoaderModule } from '../../containers';
import { SharedModule } from '../../_module/shared.module';

@NgModule({
  declarations: [UserReportComponent],
  imports: [
    CommonModule,
    FormsModule,
    UserReportRoutingModule,
    NgxDatatableModule,
    NgxPermissionsModule,
    PopoverModule.forRoot(),
    LoaderModule,
    SharedModule,
  ],
})
export class UserReportModule {}

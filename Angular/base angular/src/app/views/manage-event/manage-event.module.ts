import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageEventRoutingModule } from './manage-event-routing.module';
import { ManageEventComponent } from './manage-event.component';
import { EventAddEditComponent } from './event-add-edit/event-add-edit.component';
import { EventViewComponent } from './event-view/event-view.component';
import { EventListComponent } from './event-list/event-list.component';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxPermissionsModule } from 'ngx-permissions';
import { LoaderModule } from '../../containers';
import { SharedModule } from '../../_module/shared.module';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { TagInputModule } from 'ngx-chips';

@NgModule({
  declarations: [ManageEventComponent, EventAddEditComponent, EventViewComponent, EventListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ManageEventRoutingModule,
    NgxDatatableModule,
    NgxPermissionsModule,
    LoaderModule,
    PopoverModule.forRoot(),
    BsDatepickerModule.forRoot(),
    SharedModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    TagInputModule,
  ],
})
export class ManageEventModule {}

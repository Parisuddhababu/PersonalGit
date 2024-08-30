import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CKEditorModule } from 'ngx-ckeditor';
import { NgxPermissionsModule } from 'ngx-permissions';
import { LoaderModule } from '../../containers';
import { SharedModule } from '../../_module/shared.module';
import { AnnouncementAddEditComponent } from './announcement-add-edit/announcement-add-edit.component';
import { AnnouncementDetailsComponent } from './announcement-details/announcement-details.component';
import { AnnouncementListComponent } from './announcement-list/announcement-list.component';
import { AnnouncementReceiversComponent } from './announcement-receivers/announcement-receivers.component';
import { AnnouncementRoutingModule } from './announcement-routing.module';
import { AnnouncementComponent } from './announcement.component';

@NgModule({
  imports: [
    CommonModule,
    AnnouncementRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    NgxPermissionsModule,
    NgbModule,
    LoaderModule,
    BsDatepickerModule.forRoot(),
    SharedModule,
    CKEditorModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  declarations: [
    AnnouncementComponent,
    AnnouncementListComponent,
    AnnouncementAddEditComponent,
    AnnouncementDetailsComponent,
    AnnouncementReceiversComponent,
  ],
})
export class AnnouncementModule {}

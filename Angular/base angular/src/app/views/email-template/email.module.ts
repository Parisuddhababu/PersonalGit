import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmailComponent } from './email.component';
import { EmailRoutingModule } from './email-routing.module';
import { EmailAddEditComponent } from './email-add-edit/email-add-edit.component';
import { EmailListComponent } from './email-list/email-list.component';
import { CKEditorModule } from 'ngx-ckeditor';
import { NgxPermissionsModule } from 'ngx-permissions';
import { LoaderModule } from '../../containers';
import { SharedModule } from '../../_module/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EmailRoutingModule,
    CKEditorModule,
    NgxDatatableModule,
    NgxPermissionsModule,
    LoaderModule,
    SharedModule,
  ],
  declarations: [EmailComponent, EmailAddEditComponent, EmailListComponent],
})
export class EmailModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FaqComponent } from './faq.component';
import { FaqRoutingModule } from './faq-routing.module';
import { FaqAddEditComponent } from './faq-add-edit/faq-add-edit.component';
import { FaqListComponent } from './faq-list/faq-list.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { LoaderModule } from '../../containers';
import { SharedModule } from '../../_module/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FaqRoutingModule,
    NgxDatatableModule,
    NgxPermissionsModule,
    LoaderModule,
    SharedModule,
  ],
  declarations: [FaqComponent, FaqAddEditComponent, FaqListComponent],
})
export class FaqModule {}

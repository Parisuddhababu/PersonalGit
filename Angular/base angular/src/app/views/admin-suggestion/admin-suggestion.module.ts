import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPermissionsModule } from 'ngx-permissions';
import { LoaderModule } from '../../containers';
import { SharedModule } from '../../_module/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AdminSuggestionRoutingModule } from './admin-suggestion-routing.module';
import { AdminSuggestionComponent } from './admin-suggestion.component';
import { AdminSuggestionListComponent } from './admin-suggestion-list/admin-suggestion-list.component';
import { PopoverModule } from 'ngx-bootstrap/popover';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminSuggestionRoutingModule,
    NgxDatatableModule,
    NgxPermissionsModule,
    LoaderModule,
    PopoverModule.forRoot(),
    SharedModule,
  ],
  declarations: [AdminSuggestionComponent, AdminSuggestionListComponent],
})
export class AdminSuggestionModule {}

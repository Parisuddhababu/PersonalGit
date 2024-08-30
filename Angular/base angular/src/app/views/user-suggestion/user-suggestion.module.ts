import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from 'ngx-ckeditor';
import { NgxPermissionsModule } from 'ngx-permissions';
import { LoaderModule } from '../../containers';
import { SharedModule } from '../../_module/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UserSuggestionRoutingModule } from './user-suggestion-routing.module';
import { UserSuggestionListComponent } from './user-suggestion-list/user-suggestion-list.component';
import { UserSuggestionComponent } from './user-suggestion.component';
import { UserSuggestionAddComponent } from './user-suggestion-add/user-suggestion-add.component';
import { PopoverModule } from 'ngx-bootstrap/popover';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UserSuggestionRoutingModule,
    CKEditorModule,
    NgxDatatableModule,
    NgxPermissionsModule,
    LoaderModule,
    PopoverModule.forRoot(),
    SharedModule,
  ],
  declarations: [UserSuggestionComponent, UserSuggestionAddComponent, UserSuggestionListComponent],
})
export class UserSuggestionModule {}

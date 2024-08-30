import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CmsComponent } from './cms.component';
import { CmsRoutingModule } from './cms-routing.module';
import { CmsAddEditComponent } from './cms-add-edit/cms-add-edit.component';
import { CmsListComponent } from './cms-list/cms-list.component';
import { CKEditorModule } from 'ngx-ckeditor';
import { NgxPermissionsModule } from 'ngx-permissions';
import { LoaderModule } from '../../containers';
import { SharedModule } from '../../_module/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CmsPageBuilderComponent } from './cms-page-builder/cms-page-builder.component';
import { CmsPageViewComponent } from './cms-page-view/cms-page-view.component';
import { SafeHtml } from '../../_pipe/safe-html.pipe';
import { CmsComponentViewComponent } from './cms-component-view/cms-component-view.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CmsRoutingModule,
    CKEditorModule,
    NgxDatatableModule,
    NgxPermissionsModule,
    LoaderModule,
    SharedModule,
  ],
  declarations: [
    CmsComponent,
    CmsAddEditComponent,
    CmsListComponent,
    CmsPageBuilderComponent,
    CmsPageViewComponent,
    SafeHtml,
    CmsComponentViewComponent,
  ],
})
export class CmsModule {}

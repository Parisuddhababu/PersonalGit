import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CmsAddEditComponent } from './cms-add-edit/cms-add-edit.component';
import { CmsComponentViewComponent } from './cms-component-view/cms-component-view.component';
import { CmsListComponent } from './cms-list/cms-list.component';
import { CmsPageBuilderComponent } from './cms-page-builder/cms-page-builder.component';
import { CmsPageViewComponent } from './cms-page-view/cms-page-view.component';
import { CmsComponent } from './cms.component';

const routes: Routes = [
  {
    path: '',
    component: CmsComponent,
    data: {
      title: 'CMS_MANAGEMENT',
    },
    children: [
      {
        path: 'add',
        component: CmsAddEditComponent,
        data: {
          title: 'ADD_CMS',
          permission: 'CMS_CREATE',
        },
      },
      {
        path: 'edit/:id',
        component: CmsAddEditComponent,
        data: {
          title: 'EDIT_CMS',
          permission: 'CMS_UPDATE',
        },
      },
      {
        path: 'page-builder/:id',
        component: CmsPageBuilderComponent,
        data: {
          title: 'CMS_PAGE_BUILDER',
          permission: 'PAGE_BUILDER_CREATE',
        },
      },
      {
        path: 'view-template/:id',
        component: CmsPageViewComponent,
        data: {
          title: 'VIEW_PAGE_BUILDER',
          permission: 'PAGE_BUILDER_LOAD',
        },
      },
      {
        path: 'view-component-template/:id',
        component: CmsComponentViewComponent,
        data: {
          title: 'VIEW_COMPONENT_BUILDER',
          permission: 'PAGE_BUILDER_LOAD',
        },
      },
      {
        path: 'list',
        component: CmsListComponent,
        data: {
          title: 'CMS_LIST',
          permission: 'CMS_LIST',
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
export class CmsRoutingModule {}

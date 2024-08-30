import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryAddEditComponent } from './category-add-edit/category-add-edit.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryTreeviewComponent } from './category-treeview/category-treeview.component';
import { CategoryComponent } from './category.component';

const routes: Routes = [
  {
    path: '',
    component: CategoryComponent,
    data: {
      title: 'MANAGE_CATEGORY',
    },
    children: [
      {
        path: 'add',
        component: CategoryAddEditComponent,
        data: {
          title: 'ADD_CATEGORY',
          permission: 'CATEGORY_CREATE',
        },
      },
      {
        path: 'treeview',
        component: CategoryTreeviewComponent,
        data: {
          title: 'CATEGORY_TREEVIEW',
          permission: 'CATEGORY_TREEVIEW',
        },
      },
      {
        path: 'edit/:id',
        component: CategoryAddEditComponent,
        data: {
          title: 'EDIT_CATEGORY',
          permission: 'CATEGORY_UPDATE',
        },
      },
      {
        path: 'list',
        component: CategoryListComponent,
        data: {
          title: 'CATEGORY_LIST',
          permission: 'CATEGORY_LIST',
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
export class CategoryRoutingModule {}

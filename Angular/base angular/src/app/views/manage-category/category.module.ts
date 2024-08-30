import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeModule } from '@circlon/angular-tree-component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxPermissionsModule } from 'ngx-permissions';
import { TreeviewModule } from 'ngx-treeview';
import { LoaderModule } from '../../containers';
import { NgxTreeSelectModule } from '../../_plugins/module';
import { SharedModule } from './../../_module/shared.module';
import { CategoryAddEditComponent } from './category-add-edit/category-add-edit.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryRoutingModule } from './category-routing.module';
import { CategoryTreeviewComponent } from './category-treeview/category-treeview.component';
import { CategoryComponent } from './category.component';

@NgModule({
  declarations: [CategoryComponent, CategoryAddEditComponent, CategoryListComponent, CategoryTreeviewComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CategoryRoutingModule,
    NgxDatatableModule,
    TreeModule,
    NgxPermissionsModule,
    TreeviewModule.forRoot(),
    LoaderModule,
    SharedModule,
    NgxTreeSelectModule.forRoot({
      allowFilter: false,
      allowParentSelection: true,
      expandMode: 'All',
    }),
  ],
})
export class CategoryModule {}

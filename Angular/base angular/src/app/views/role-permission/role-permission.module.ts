import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolePermissionRoutingModule } from './role-permission-routing.module';
import { RolePermissionComponent } from './role-permission.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeviewModule } from 'ngx-treeview';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../_module/shared.module';

@NgModule({
  imports: [
    CommonModule,
    RolePermissionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    NgxPermissionsModule,
    ModalModule.forRoot(),
    TreeviewModule.forRoot(),
    SharedModule,
  ],
  declarations: [RolePermissionComponent],
})
export class RolePermissionModule {}

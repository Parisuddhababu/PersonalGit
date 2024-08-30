import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubadminComponent } from './subadmin.component';
import { SubadminRoutingModule } from './subadmin-routing.module';
import { SubadminAddEditComponent } from './subadmin-add-edit/subadmin-add-edit.component';
import { SubadminListComponent } from './subadmin-list/subadmin-list.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { LoaderModule } from '../../containers';
import { SharedModule } from '../../_module/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SubadminRoutingModule,
    NgxDatatableModule,
    NgxPermissionsModule,
    LoaderModule,
    SharedModule,
  ],
  declarations: [SubadminComponent, SubadminAddEditComponent, SubadminListComponent],
})
export class SubadminModule {}

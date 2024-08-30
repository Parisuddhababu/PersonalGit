import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageOfferRoutingModule } from './manage-offer-routing.module';
import { ManageOfferComponent } from './manage-offer.component';
import { ManageOfferListComponent } from './manage-offer-list/manage-offer-list.component';
import { ManageOfferAddEditComponent } from './manage-offer-add-edit/manage-offer-add-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPermissionsModule } from 'ngx-permissions';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoaderModule } from '../../containers';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../_module/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [ManageOfferComponent, ManageOfferListComponent, ManageOfferAddEditComponent],
  imports: [
    CommonModule,
    ManageOfferRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxDatatableModule,
    NgxPermissionsModule,
    NgbModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    LoaderModule,
    NgMultiSelectDropDownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    SharedModule,
  ],
})
export class ManageOfferModule {}

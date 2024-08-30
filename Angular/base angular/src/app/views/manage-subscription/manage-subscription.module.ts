import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CookieService } from 'ngx-cookie-service';
import { NgxPermissionsModule } from 'ngx-permissions';
import { LoaderModule } from '../../containers';
import { SharedModule } from '../../_module/shared.module';
import { ManageSubscriptionRoutingModule } from './manage-subscription-routing.module';
import { ManageSubscriptionComponent } from './manage-subscription.component';
import { SubscriptionAddEditComponent } from './subscription-add-edit/subscription-add-edit.component';
import { SubscriptionListComponent } from './subscription-list/subscription-list.component';
import { SubscriptionViewComponent } from './subscription-view/subscription-view.component';

@NgModule({
  declarations: [ManageSubscriptionComponent, SubscriptionListComponent, SubscriptionAddEditComponent, SubscriptionViewComponent],
  imports: [
    CommonModule,
    ManageSubscriptionRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    NgxPermissionsModule,
    NgbModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    LoaderModule,
    BsDatepickerModule.forRoot(),
    SharedModule,
  ],
  providers: [CookieService],
})
export class ManageSubscriptionModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageContactRoutingModule } from './manage-contact-routing.module';
import { ManageContactListComponent } from './manage-contact-list/manage-contact-list.component';
import { ManageContactComponent } from './manage-contact.component';
import { FormsModule } from '@angular/forms';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoaderModule } from '../../containers/loader/loader.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../_module/shared.module';
import { CookieService } from 'ngx-cookie-service';
import { PopoverModule } from 'ngx-bootstrap/popover';

@NgModule({
  declarations: [ManageContactComponent, ManageContactListComponent],
  imports: [
    CommonModule,
    ManageContactRoutingModule,
    FormsModule,
    NgxDatatableModule,
    NgxPermissionsModule,
    NgbModule,
    LoaderModule,
    PopoverModule.forRoot(),
    SharedModule,
  ],
  providers: [CookieService],
})
export class ManageContactModule {}

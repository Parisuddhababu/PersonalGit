import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPermissionsModule } from 'ngx-permissions';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoaderModule } from '../../containers';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ImageCropperModule } from 'ngx-image-cropper';
import { SharedModule } from '../../_module/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CookieService } from 'ngx-cookie-service';

import { ManageBannerRoutingModule } from './manage-banner-routing.module';
import { ManageBannerComponent } from './manage-banner.component';
import { ManageBannerListComponent } from './manage-banner-list/manage-banner-list.component';
import { ManageBannerAddEditComponent } from './manage-banner-add-edit/manage-banner-add-edit.component';

@NgModule({
  declarations: [ManageBannerListComponent, ManageBannerAddEditComponent, ManageBannerComponent],
  imports: [
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
    ImageCropperModule,
    SharedModule,
    ManageBannerRoutingModule,
  ],
  providers: [CookieService],
})
export class ManageBannerModule {}

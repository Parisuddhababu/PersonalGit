import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BsMediaRoutingModule } from './bs-media-routing.module';
import { BsMediaComponent } from './bs-media.component';
import { BsMediaListComponent } from './bs-media-list/bs-media-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { NgxPermissionsModule } from 'ngx-permissions';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../containers';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ImageCropperModule } from 'ngx-image-cropper';
import { SharedModule } from '../../_module/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TreeviewModule } from 'ngx-treeview';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsMediaListDetailsComponent } from './bs-media-list/bs-media-list-details.component';

@NgModule({
  declarations: [BsMediaComponent, BsMediaListComponent, BsMediaListDetailsComponent],
  imports: [
    CommonModule,
    BsMediaRoutingModule,
    CommonModule,
    FormsModule,
    // BrowserAnimationsModule,
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
    ModalModule.forRoot(),
    TreeviewModule.forRoot(),
    TabsModule,
  ],
})
export class BsMediaModule {}

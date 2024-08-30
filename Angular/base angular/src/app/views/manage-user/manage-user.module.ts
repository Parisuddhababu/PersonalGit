import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageUserRoutingModule } from './manage-user-routing.module';
import { ManageUserComponent } from './manage-user.component';
import { ManageUserAddEditComponent } from './manage-user-add-edit/manage-user-add-edit.component';
import { ManageUserListComponent } from './manage-user-list/manage-user-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { NgxPermissionsModule } from 'ngx-permissions';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoaderModule } from '../../containers';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ManageUserViewComponent } from './manage-user-view/manage-user-view.component';
import { SharedModule } from '../../_module/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ManageUserRoutingModule,
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
  ],
  declarations: [ManageUserComponent, ManageUserAddEditComponent, ManageUserListComponent, ManageUserViewComponent],
  providers: [CookieService],
})
export class ManageUserModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { LoaderModule } from '../../containers';
import { SharedModule } from '../../_module/shared.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  imports: [
    CommonModule,
    SettingsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPermissionsModule,
    LoaderModule,
    SharedModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
  declarations: [SettingsComponent],
})
export class SettingsModule {}

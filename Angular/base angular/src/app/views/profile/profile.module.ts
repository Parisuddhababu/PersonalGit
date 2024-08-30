import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { ReactiveFormsModule } from '@angular/forms';
// Profile Routing
import { ProfileRoutingModule } from './profile-routing.module';
import { LoaderModule } from '../../containers';
import { SharedModule } from '../../_module/shared.module';

@NgModule({
  imports: [CommonModule, ProfileRoutingModule, FormsModule, LoaderModule, SharedModule],
  declarations: [ProfileComponent],
})
export class ProfileModule {}

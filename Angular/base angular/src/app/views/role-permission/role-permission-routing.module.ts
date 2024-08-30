import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolePermissionComponent } from './role-permission.component';

const routes: Routes = [
  {
    path: '',
    component: RolePermissionComponent,
    data: {
      title: 'ROLE_PERMISSION',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RolePermissionRoutingModule {}

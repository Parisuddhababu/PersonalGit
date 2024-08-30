import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmailAddEditComponent } from './email-add-edit/email-add-edit.component';
import { EmailListComponent } from './email-list/email-list.component';
import { EmailComponent } from './email.component';

const routes: Routes = [
  {
    path: '',
    component: EmailComponent,
    data: {
      title: 'EMAIL_TEMPLATE',
    },
    children: [
      {
        path: 'edit/:id',
        component: EmailAddEditComponent,
        data: {
          title: 'Edit Email Template',
          permission: 'EMAIL_TEMP_UPDATE',
        },
      },
      {
        path: 'list',
        component: EmailListComponent,
        data: {
          title: 'EMAIL_TEMPLATE_LIST',
          permission: 'EMAIL_TEMP_LIST',
        },
      },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmailRoutingModule {}

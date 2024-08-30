import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FaqAddEditComponent } from './faq-add-edit/faq-add-edit.component';
import { FaqListComponent } from './faq-list/faq-list.component';
import { FaqComponent } from './faq.component';

const routes: Routes = [
  {
    path: '',
    component: FaqComponent,
    data: {
      title: 'FAQ_MANAGEMENT',
    },
    children: [
      {
        path: 'add',
        component: FaqAddEditComponent,
        data: {
          title: 'ADD_FAQ',
          permission: 'FAQ_CREATE',
        },
      },
      {
        path: 'edit/:id',
        component: FaqAddEditComponent,
        data: {
          title: 'EDIT_FAQ',
          permission: 'FAQ_UPDATE',
        },
      },
      {
        path: 'list',
        component: FaqListComponent,
        data: {
          title: 'FAQ_LIST',
          permission: 'FAQ_LIST',
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
export class FaqRoutingModule {}

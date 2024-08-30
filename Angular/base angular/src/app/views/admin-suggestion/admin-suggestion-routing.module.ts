import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminSuggestionListComponent } from './admin-suggestion-list/admin-suggestion-list.component';
import { AdminSuggestionComponent } from './admin-suggestion.component';

const routes: Routes = [
  {
    path: '',
    component: AdminSuggestionComponent,
    data: {
      title: 'SUGGESTION',
    },
    children: [
      {
        path: 'list',
        component: AdminSuggestionListComponent,
        data: {
          title: 'SUGGESTION_LIST',
          permission: 'ADMIN_LIST_SUGGESTION',
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
export class AdminSuggestionRoutingModule { }

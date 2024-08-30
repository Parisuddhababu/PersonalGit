import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserSuggestionComponent } from './user-suggestion.component';
import { UserSuggestionAddComponent } from './user-suggestion-add/user-suggestion-add.component';
import { UserSuggestionListComponent } from './user-suggestion-list/user-suggestion-list.component';

const routes: Routes = [
  {
    path: '',
    component: UserSuggestionComponent,
    data: {
      title: 'Suggestion',
    },
    children: [
      {
        path: 'add',
        component: UserSuggestionAddComponent,
        data: {
          title: 'Add Suggestion',
          permission: 'USER_SUGGESTION_CREATE',
          preTitle: 'Suggestion',
          preUrl: 'user-suggestion/list',
        },
      },
      {
        path: 'list',
        component: UserSuggestionListComponent,
        data: {
          title: 'Suggestion List',
          permission: 'USER_SUGGESTION_LIST',
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
export class UserSuggestionRoutingModule {}

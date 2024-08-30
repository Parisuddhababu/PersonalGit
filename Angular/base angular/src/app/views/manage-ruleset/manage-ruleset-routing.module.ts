import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageRulesetComponent } from './manage-ruleset.component';
import { RulesetAddEditComponent } from './ruleset-add-edit/ruleset-add-edit.component';
import { RulesetListComponent } from './ruleset-list/ruleset-list.component';

const routes: Routes = [
  {
    path: '',
    component: ManageRulesetComponent,
    data: {
      title: 'MANAGE_RULESETS',
    },
    children: [
      {
        path: 'add',
        component: RulesetAddEditComponent,
        data: {
          title: 'ADD_RULESETS',
          permission: 'RULESETS_CREATE',
        },
      },
      {
        path: 'edit/:id',
        component: RulesetAddEditComponent,
        data: {
          title: 'EDIT_RULESETS',
          permission: 'RULESETS_UPDATE',
        },
      },
      {
        path: 'list',
        component: RulesetListComponent,
        data: {
          title: 'RULESETS_LIST',
          permission: 'RULESETS_LIST',
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
export class ManageRulesetRoutingModule {}

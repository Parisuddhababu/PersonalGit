import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageRulesetRoutingModule } from './manage-ruleset-routing.module';
import { ManageRulesetComponent } from './manage-ruleset.component';
import { RulesetListComponent } from './ruleset-list/ruleset-list.component';
import { RulesetAddEditComponent } from './ruleset-add-edit/ruleset-add-edit.component';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxPermissionsModule } from 'ngx-permissions';
import { LoaderModule } from '../../containers';
import { SharedModule } from '../../_module/shared.module';
import { PopoverModule } from 'ngx-bootstrap/popover';

@NgModule({
  declarations: [ManageRulesetComponent, RulesetListComponent, RulesetAddEditComponent],
  imports: [
    CommonModule,
    FormsModule,
    ManageRulesetRoutingModule,
    NgxDatatableModule,
    NgxPermissionsModule,
    LoaderModule,
    PopoverModule.forRoot(),
    SharedModule,
  ],
})
export class ManageRulesetModule {}

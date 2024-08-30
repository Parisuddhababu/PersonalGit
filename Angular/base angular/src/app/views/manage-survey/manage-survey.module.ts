import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageSurveyRoutingModule } from './manage-survey-routing.module';
import { ManageSurveyComponent } from './manage-survey.component';
import { SurveyListComponent } from './survey-list/survey-list.component';
import { SurveyAddEditComponent } from './survey-add-edit/survey-add-edit.component';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoaderModule } from '../../containers';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../_module/shared.module';
import { SurveyQuestionsComponent } from './survey-questions/survey-questions.component';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { SurveyReportComponent } from './survey-report/survey-report.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [ManageSurveyComponent, SurveyListComponent, SurveyAddEditComponent, SurveyQuestionsComponent, SurveyReportComponent],
  imports: [
    CommonModule,
    ManageSurveyRoutingModule,
    FormsModule,
    NgxDatatableModule,
    NgxPermissionsModule,
    NgbModule,
    LoaderModule,
    BsDatepickerModule.forRoot(),
    PopoverModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    SharedModule,
  ],
})
export class ManageSurveyModule {}

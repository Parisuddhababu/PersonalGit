import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserSurveyRoutingModule } from './user-survey-routing.module';
import { UserSurveyComponent } from './user-survey.component';
import { SurveyAnswersComponent } from './survey-answers/survey-answers.component';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoaderModule } from '../../containers';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { SharedModule } from '../../_module/shared.module';
import { UserSurveyListComponent } from './user-survey-list/user-survey-list.component';
import { MultiCheckboxValidationDirective } from '../../_directives/multi-checkbox-validation.directive';
import { ViewAnswerComponent } from './view-answer/view-answer.component';

@NgModule({
  declarations: [
    UserSurveyComponent,
    SurveyAnswersComponent,
    UserSurveyListComponent,
    MultiCheckboxValidationDirective,
    ViewAnswerComponent,
  ],
  imports: [
    CommonModule,
    UserSurveyRoutingModule,
    FormsModule,
    NgxDatatableModule,
    NgxPermissionsModule,
    NgbModule,
    LoaderModule,
    BsDatepickerModule.forRoot(),
    PopoverModule.forRoot(),
    SharedModule,
  ],
})
export class UserSurveyModule {}

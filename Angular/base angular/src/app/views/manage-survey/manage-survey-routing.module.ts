import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageSurveyComponent } from './manage-survey.component';
import { SurveyAddEditComponent } from './survey-add-edit/survey-add-edit.component';
import { SurveyListComponent } from './survey-list/survey-list.component';
import { SurveyQuestionsComponent } from './survey-questions/survey-questions.component';
import { SurveyReportComponent } from './survey-report/survey-report.component';

const routes: Routes = [
  {
    path: '',
    component: ManageSurveyComponent,
    data: {
      title: 'MANAGE_SURVEY',
    },
    children: [
      {
        path: 'list',
        component: SurveyListComponent,
        data: {
          title: 'SURVEY_LIST',
          permission: 'SURVEY_LIST',
        },
      },
      {
        path: 'add',
        component: SurveyAddEditComponent,
        data: {
          title: 'Add Survey',
          permission: 'SURVEY_CREATE',
          preTitle: 'Survey List',
          preUrl: 'manage-survey/list',
        },
      },
      {
        path: 'edit/:id',
        component: SurveyAddEditComponent,
        data: {
          title: 'Edit Survey',
          permission: 'SURVEY_UPDATE',
          preTitle: 'Survey List',
          preUrl: 'manage-survey/list',
        },
      },
      {
        path: 'add-questions/:id',
        component: SurveyQuestionsComponent,
        data: {
          title: 'Survey Questions',
          preTitle: 'Survey List',
          preUrl: 'manage-survey/list',
        },
      },
      {
        path: 'report/:id',
        component: SurveyReportComponent,
        data: {
          title: 'Survey Report',
          permission: 'SURVEY_REPORT',
          preTitle: 'Survey List',
          preUrl: 'manage-survey/list',
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
export class ManageSurveyRoutingModule { }

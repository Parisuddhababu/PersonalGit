import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserSurveyComponent } from './user-survey.component';
import { UserSurveyListComponent } from './user-survey-list/user-survey-list.component';
import { SurveyAnswersComponent } from './survey-answers/survey-answers.component';
import { ViewAnswerComponent } from './view-answer/view-answer.component';

const routes: Routes = [
  {
    path: '',
    component: UserSurveyComponent,
    data: {
      title: 'User Survey',
    },
    children: [
      {
        path: 'add-answers/:id',
        component: SurveyAnswersComponent,
        data: {
          title: 'Survey Answers',
          preTitle: 'Survey List',
          preUrl: 'manage-survey/list',
        },
      },
      {
        path: 'view-answers/:id',
        component: ViewAnswerComponent,
        data: {
          title: 'View Answers',
          preTitle: 'Survey List',
          preUrl: 'manage-survey/list',
        },
      },
      {
        path: 'list',
        component: UserSurveyListComponent,
        data: {
          title: 'Survey List',
          permission: 'USER_SURVEY_LIST',
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
export class UserSurveyRoutingModule {}

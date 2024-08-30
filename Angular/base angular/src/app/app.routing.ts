import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Import Containers
import { DefaultLayoutComponent } from './containers';
import { P403Component } from './views/error/403.component';
import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { ResetPasswordComponent } from './views/reset-password/reset-password.component';
import { ChatComponent } from './_components/chat/chat.component';
import { AuthGuard } from './_guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404',
    },
  },
  {
    path: '403',
    component: P403Component,
    data: {
      title: 'Page 403',
    },
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500',
    },
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page',
    },
  },
  {
    path: 'password/reset',
    component: ResetPasswordComponent,
    data: {
      title: 'Reset Password Page',
    },
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'HOME',
    },

    children: [
      {
        path: 'chat',
        component: ChatComponent,
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/dashboard.module').then((m) => m.DashboardModule),
        canActivateChild: [AuthGuard],
      },
      {
        path: 'subadmin',
        loadChildren: () => import('./views/manage-subadmin/subadmin.module').then((m) => m.SubadminModule),
        canActivateChild: [AuthGuard],
      },
      {
        path: 'manage-user',
        loadChildren: () => import('./views/manage-user/manage-user.module').then((m) => m.ManageUserModule),
        canActivateChild: [AuthGuard],
      },
      {
        path: 'profile',
        loadChildren: () => import('./views/profile/profile.module').then((m) => m.ProfileModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'cms',
        loadChildren: () => import('./views/cms/cms.module').then((m) => m.CmsModule),
        canActivateChild: [AuthGuard],
      },
      {
        path: 'email',
        loadChildren: () => import('./views/email-template/email.module').then((m) => m.EmailModule),
        canActivateChild: [AuthGuard],
      },
      {
        path: 'faq',
        loadChildren: () => import('./views/faq/faq.module').then((m) => m.FaqModule),
        canActivateChild: [AuthGuard],
      },
      {
        path: 'category',
        loadChildren: () => import('./views/manage-category/category.module').then((m) => m.CategoryModule),
        canActivateChild: [AuthGuard],
      },
      // Access chunk Video upload route
      // author : Harsha Prajapati
      // date : 28-07-2020
      // {
      //   path: 'video-upload',
      //   loadChildren: () => import('./views/video-upload/video-upload.module').then(m => m.VideoUploadModule),
      //   canActivateChild: [AuthGuard]
      // },
      {
        path: 'role-permissions',
        loadChildren: () => import('./views/role-permission/role-permission.module').then((m) => m.RolePermissionModule),
        canActivateChild: [AuthGuard],
      },
      {
        path: 'enquiry',
        loadChildren: () => import('./views/manage-contact/manage-contact.module').then((m) => m.ManageContactModule),
        canActivateChild: [AuthGuard],
      },
      {
        path: 'user-suggestion',
        loadChildren: () => import('./views/user-suggestion/user-suggestion.module').then((m) => m.UserSuggestionModule),
        canActivateChild: [AuthGuard],
      },
      {
        path: 'suggestion',
        loadChildren: () => import('./views/admin-suggestion/admin-suggestion.module').then((m) => m.AdminSuggestionModule),
        canActivateChild: [AuthGuard],
      },
      {
        path: 'manage-survey',
        loadChildren: () => import('./views/manage-survey/manage-survey.module').then((m) => m.ManageSurveyModule),
        canActivateChild: [AuthGuard],
      },
      {
        path: 'user-survey',
        loadChildren: () => import('./views/user-survey/user-survey.module').then((m) => m.UserSurveyModule),
        canActivateChild: [AuthGuard],
      },
      {
        path: 'settings',
        loadChildren: () => import('./views/settings/settings.module').then((m) => m.SettingsModule),
        canActivateChild: [AuthGuard],
      },
      {
        path: 'manage-announcement',
        loadChildren: () => import('./views/announcement/announcement.module').then((m) => m.AnnouncementModule),
        canActivateChild: [AuthGuard],
      },
      {
        path: 'activity-tracking',
        loadChildren: () => import('./views/activity-tracking/activity-tracking.module').then((m) => m.ActivityTrackingModule),
        canActivateChild: [AuthGuard],
      },
      {
        path: 'manage-banner',
        loadChildren: () => import('./views/manage-banner/manage-banner.module').then((m) => m.ManageBannerModule),
        canActivateChild: [AuthGuard],
      },
      {
        path: 'location',
        loadChildren: () => import('./views/manage-location/manage-location.module').then((m) => m.ManageLocationModule),
        canActivateChild: [AuthGuard],
      },
      {
        path: 'manage-subscription',
        loadChildren: () => import('./views/manage-subscription/manage-subscription.module').then((m) => m.ManageSubscriptionModule),
        canActivateChild: [AuthGuard],
      },
      {
        path: 'bs-media',
        loadChildren: () => import('./views/bs-media/bs-media.module').then((m) => m.BsMediaModule),
        canActivateChild: [AuthGuard],
      },
      {
        path: 'manage-offer',
        loadChildren: () => import('./views/manage-offer/manage-offer.module').then((m) => m.ManageOfferModule),
        canActivateChild: [AuthGuard],
      },
      {
        path: 'review',
        loadChildren: () => import('./views/review/review.module').then((m) => m.ReviewModule),
        canActivateChild: [AuthGuard],
      },
      {
        path: 'user-report',
        loadChildren: () => import('./views/user-report/user-report.module').then((m) => m.UserReportModule),
        canActivateChild: [AuthGuard],
      },
      {
        path: 'rulesets',
        loadChildren: () => import('./views/manage-ruleset/manage-ruleset.module').then((m) => m.ManageRulesetModule),
        canActivateChild: [AuthGuard],
      },
      {
        path: 'event',
        loadChildren: () => import('./views/manage-event/manage-event.module').then((m) => m.ManageEventModule),
        canActivateChild: [AuthGuard],
      },
    ],
  },
  {
    path: '**',
    redirectTo: '404',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}

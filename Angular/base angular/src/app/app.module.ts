import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injector, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppAsideModule, AppBreadcrumbModule, AppFooterModule, AppHeaderModule, AppSidebarModule } from '@coreui/angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ChartsModule } from 'ng2-charts';
// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ToastrModule } from 'ngx-toastr';
import { TreeviewModule } from 'ngx-treeview';
import { AppComponent } from './app.component';
// Import routing module
import { AppRoutingModule } from './app.routing';
// Import containers
import { DefaultLayoutComponent, LoaderModule, MultiLangBreadcrumbComponent } from './containers';
import { P403Component } from './views/error/403.component';
import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { OfferReportListComponent } from './views/manage-offer/manage-offer-list/offer-report-list.component';
import { SurveyUserReportComponent } from './views/manage-survey/survey-list/user-report.component';
import { CheckUserListComponent } from './views/manage-survey/survey-report/check-user-list.component';
import { TextUserListComponent } from './views/manage-survey/survey-report/text-user-list.component';
import { ResetPasswordComponent } from './views/reset-password/reset-password.component';
import { BaseServiceInjector } from './_components/base.injector';
import { ChatModule } from './_components/chat/chat.module';
import { AuthGuard } from './_guards/auth.guard';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { DescriptionModalComponent } from './_modal/description.component';
import { ViewImageModalComponent } from './_modal/view-image.component';
import { HttpLoaderFactory, SharedModule } from './_module/shared.module';

const APP_CONTAINERS = [DefaultLayoutComponent];

const BASE_MODULES = [CommonModule, FormsModule, ReactiveFormsModule];

@NgModule({
  imports: [
    BrowserModule,
    ...BASE_MODULES,
    HttpClientModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    BrowserAnimationsModule,
    ChatModule,
    TabsModule.forRoot(),
    ChartsModule,
    ModalModule.forRoot(),
    NgbModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      closeButton: true,
      preventDuplicates: true,
    }), // ToastrModule added
    TreeviewModule.forRoot(),
    NgxPermissionsModule.forRoot(),
    LoaderModule,
    NgxDatatableModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    SharedModule,
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    P403Component,
    P404Component,
    P500Component,
    LoginComponent,
    ResetPasswordComponent,
    TextUserListComponent,
    CheckUserListComponent,
    SurveyUserReportComponent,
    ViewImageModalComponent,
    OfferReportListComponent,
    DescriptionModalComponent,
    MultiLangBreadcrumbComponent,
  ],
  entryComponents: [
    MultiLangBreadcrumbComponent,
    TextUserListComponent,
    CheckUserListComponent,
    SurveyUserReportComponent,
    ViewImageModalComponent,
    OfferReportListComponent,
    DescriptionModalComponent,
  ],
  providers: [
    AuthGuard,
    // { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private injector: Injector) {
    // Create global Service Injector.
    BaseServiceInjector.injector = this.injector;
  }
}

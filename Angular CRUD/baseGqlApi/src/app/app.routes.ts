import { Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { BannerComponent } from './views/banner/banner.component';
import { AddBannerComponent } from './views/banner/add-banner/add-banner.component';
import { NotFoundComponent } from './views/not-found/not-found.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path:'banner',
        component:BannerComponent
    },
    {
        path:'banner/add',
        component:AddBannerComponent
    },
    {
        path:'banner/edit/:id',
        component:AddBannerComponent
    },
    {
        path:'**',
        component:NotFoundComponent
    }

];

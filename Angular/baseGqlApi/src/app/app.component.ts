import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { graphqlProvider } from './framework/graphql/apollo.provider';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { BannerComponent } from './views/banner/banner.component';
import { NotFoundComponent } from './views/not-found/not-found.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DashboardComponent,BannerComponent,NotFoundComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [graphqlProvider],
})
export class AppComponent {}

import { Component } from '@angular/core';

import { ServerStatusComponent } from './dashboard/server-status/server-status.component';
import { TrafficComponent } from './dashboard/traffic/traffic.component';
import { DashboardItemComponent } from './dashboard/dashboard-item/dashboard-item.component';
import { HeaderComponent } from './header/header/header.component';
import { TicketsComponent } from './dashboard/tickets/tickets.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    ServerStatusComponent,
    TrafficComponent,
    TicketsComponent,
    DashboardItemComponent
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {}
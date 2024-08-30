import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { graphqlProvider } from './framework/graphql/apollo.provider';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,LoginComponent, ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers:[graphqlProvider]
})
export class AppComponent {
 
}

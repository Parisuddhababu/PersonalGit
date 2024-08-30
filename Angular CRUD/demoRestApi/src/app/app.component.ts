import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PostsComponent } from './views/posts/posts.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,PostsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}

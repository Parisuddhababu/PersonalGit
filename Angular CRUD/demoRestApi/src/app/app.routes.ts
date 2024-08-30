import { Routes } from '@angular/router';
import { PostsComponent } from './views/posts/posts.component';
import { AddEditPostsComponent } from './views/posts/add-edit-posts/add-edit-posts.component';

export const routes: Routes = [
    { path: '', redirectTo: 'post', pathMatch: 'full' },
    { path: 'post', component: PostsComponent },
    { path: 'post/create-post', component: AddEditPostsComponent },
    { path: 'post/edit/:id', component: AddEditPostsComponent },
];

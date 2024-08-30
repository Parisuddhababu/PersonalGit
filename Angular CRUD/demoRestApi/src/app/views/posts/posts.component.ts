import { Component, OnInit,inject } from '@angular/core';
import { PostsService } from '../../service/posts.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AddEditPostsComponent } from './add-edit-posts/add-edit-posts.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule,RouterModule,AddEditPostsComponent,ReactiveFormsModule,PaginationComponent],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss',
  providers: [PostsService,ToastrService]
})
export class PostsComponent implements OnInit{
  posts: any[] = [];
  filteredPosts: any[] = [];
  displayedPosts: any[] = [];
  sortOrder: 'asc' | 'desc' = 'asc';
  sortColumn: string = '';
  page: number = 1;
  limit: number = 10;
  constructor(private postsService: PostsService,private router: Router) {}
  private toastr = inject(ToastrService);

form=new FormGroup({
  title: new FormControl(''),
})

ngOnInit(): void {
  this.form.get('title')?.valueChanges.subscribe((value) => {
    this.filterPosts(value!);
    this.page=1;
  });
  this.fetchPosts();
}

fetchPosts() {
  this.postsService.getPosts().subscribe(
    (data) => {
      this.posts = data;
      this.filterPosts(this.form.get('title')?.value || '');
    },
    (error) => {
      console.error('Error fetching posts', error);
    }
  );
}
toggleSorting(column: string) {
  if (this.sortColumn === column) {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    this.sortColumn = column;
    this.sortOrder = 'asc';
  }
  this.sortPosts();
}

sortPosts() {
  this.filteredPosts.sort((a, b) => {
    let comparison = 0;
    if (a[this.sortColumn] > b[this.sortColumn]) {
      comparison = 1;
    } else if (a[this.sortColumn] < b[this.sortColumn]) {
      comparison = -1;
    }
    return this.sortOrder === 'asc' ? comparison : -comparison;
  });
  this.updateDisplayedPosts();
}
updateDisplayedPosts() {
  const startIndex = (this.page - 1) * this.limit;
  const endIndex = startIndex + this.limit;
  this.displayedPosts = this.filteredPosts.slice(startIndex, endIndex);
}
filterPosts(title: string) {
  if (!title) {
    this.filteredPosts = this.posts;
  } else {
    this.filteredPosts = this.posts.filter(post =>
      post.title.toLowerCase().includes(title.toLowerCase())
    );
  }
  this.page = 1; 
  this.sortPosts();
  this.updateDisplayedPosts();
}
onPageChanged(newPage: number): void {
  this.page = newPage;
  this.updateDisplayedPosts();
}
    createPost(){
    this.router.navigate(['post/create-post']);
    }
    editPost(id: number) {
      this.router.navigate([`post/edit/${id}`]);
    }
    deletePost(id: number) {
      this.postsService.deletePost(id).subscribe(() => {
        this.toastr.success("deleted successfully");
        this.posts = this.posts.filter((post) => post.id !== id);
      });
    }
}

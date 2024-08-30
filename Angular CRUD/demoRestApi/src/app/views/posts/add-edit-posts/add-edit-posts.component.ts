import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PostsService } from '../../../service/posts.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-edit-posts',
  standalone: true,
  imports: [RouterModule,CommonModule,ReactiveFormsModule],
  templateUrl: './add-edit-posts.component.html',
  styleUrl: './add-edit-posts.component.scss',
  providers: [PostsService,ToastrService],
})
export class AddEditPostsComponent implements OnInit {
  paramId:number=0;
  constructor(private postsService:PostsService,private router: Router,private route: ActivatedRoute) {}
  private toastr = inject(ToastrService);

ngOnInit(): void {
  this.paramId = this.route.snapshot.params['id'];
  if(this.paramId){
    this.postsService.getPostById(this.paramId).subscribe((data)=>{
      this.form.patchValue(data);
    })
  }
}
  form=new FormGroup({
    id: new FormControl('',{validators: [Validators.required, Validators.pattern('^[0-9]+$')]}),
    userId: new FormControl('',{validators: [Validators.required, Validators.pattern('^[0-9]+$')]}),
    title: new FormControl('',{validators: [Validators.required]}),
    body: new FormControl('',{validators: [Validators.required]}),  
  })
  /* to submit the form */
  onSubmit() {
    if(this.paramId){
      this.postsService.updatePost(this.paramId,this.form.value).subscribe(()=>{
        this.toastr.success('Post updated successfully');
        this.form.reset();
        this.router.navigate(['/post'])
      });
    }
    else{
      this.postsService.createPost(this.form.value).subscribe(()=>{
        this.toastr.success('Post created successfully');
        this.form.reset();
        this.router.navigate(['/post'])
      });
    }
  }
  Cancel() {
    this.router.navigate(['/post'])
  }
  }

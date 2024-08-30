import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../service/authentication.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ApolloModule } from 'apollo-angular';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ApolloModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers:[AuthenticationService]
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  onSubmit(form:NgForm) {
  
    if(form.invalid){
      console.log("invalid Form")
      return
    }
    if (this.email && this.password) {
      this.authService.login(this.email, this.password).subscribe({
        next:()=>{
          console.log('login sucess');
          form.reset();
        }
      })
    }
  }
}

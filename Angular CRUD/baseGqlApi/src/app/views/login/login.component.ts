import { Component, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../service/authentication.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ApolloModule } from 'apollo-angular';
import { HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { ToastrService ,ToastrModule} from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ApolloModule,
    HttpClientModule,
    ToastrModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [AuthenticationService,ToastrService],
})
export class LoginComponent implements OnDestroy {
  email: string = '';
  password: string = '';
  private subscription: Subscription = new Subscription();
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (this.email && this.password) {
      const loginSubscription =  this.authService.login(this.email, this.password).subscribe({
        next: () => {
          this.toastr.success('login successfully')
          this.router.navigate(['/dashboard']);
          form.reset();
        },
      });
      this.subscription.add(loginSubscription);
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

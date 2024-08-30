import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  templateUrl: '403.component.html',
})
export class P403Component {
  constructor(private router: Router) { }
  navigate() {
    this.router.navigateByUrl('/dashboard');
  }
}

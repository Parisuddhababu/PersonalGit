  import { Component } from '@angular/core';
  import { FormsModule, NgForm } from '@angular/forms';

  @Component({
    selector: 'app-contact-us',
    standalone: true,
    imports: [FormsModule],
    templateUrl:'./contact-us.component.html',
    styleUrl: './contact-us.component.css',
  })
  export class ContactUsComponent {
    onSubmit(form:NgForm) {}
    onCancel() {}
  }

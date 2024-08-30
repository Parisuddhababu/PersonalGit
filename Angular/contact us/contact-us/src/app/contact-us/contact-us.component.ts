import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ContactUsService } from './contact-us.service';
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css',
})

export class ContactUsComponent {
  form = new FormGroup({
    firstName: new FormControl('', { validators: [Validators.required] }),
    lastName: new FormControl('', { validators: [Validators.required] }),
    contact: new FormControl('', { validators: [Validators.required] }),
    email: new FormControl('', {
      validators: [
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
      ],
    }),
  });

  constructor(private contactUsService: ContactUsService) {}
  onSubmit() {
    if (this.form.valid) {
      const formData = this.form.value;
      this.contactUsService.submitForm(formData).subscribe(
        (response) => {
          console.log(response, 'data created successfully');
          this.form.reset();
        },
        (error) => {
          console.error('Error submitting form:', error);
        }
      );
    }
  }
  onCancel() {
    this.form.reset();
  }
}

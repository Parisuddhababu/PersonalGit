import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ContactUsService } from './contactus.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-contactus',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contactus.component.html',
  styleUrl: './contactus.component.css',
})
export class ContactusComponent {
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
  responseData: any[] = [];
  constructor(private contactUsService: ContactUsService) {}
  onSubmit() {
    if (this.form.valid) {
      const formData = {
        id: Math.random().toString(),
        ...this.form.value,
      };

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
  Cancel() {
    this.form.reset();
  }
  getFormDetails() {
    this.contactUsService.getDetails().subscribe((response) => {
      this.responseData = response;

      for(let response of this.responseData){
        console.log(response);
      }
    });
  }
  onDelete(id: number, contact: any) {
    console.log(contact);
    const stringId = id.toString();
    console.log(id,'delete id')
    this.contactUsService.deleteContact(contact).subscribe(
      (response) => {
        console.log('Contact deleted successfully');
        this.responseData = this.responseData.filter(contact => contact.id !== id);
      },
      (error) => {
        console.error('Error deleting contact:', error);
      }
    );
   
  }
  onEdit(id:string){
    console.log(id,'edit id');
  }

}

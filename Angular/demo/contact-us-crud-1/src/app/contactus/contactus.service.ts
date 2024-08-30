import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class ContactUsService {
  constructor(private http: HttpClient) {}

  submitForm(formData: any): Observable<any> {
    return this.http.post(environment.API_Url, formData);
  }

  // getDetails() {
  //   return this.http.get(environment.API_Url).pipe(
  //     map((responseData) => {
  //       const arrayOfObjects = Object.values(responseData);
  //       const id = Object.keys(responseData);
  //       console.log(Object.keys(responseData));
  //       console.log(responseData);
  //       return [id, ...arrayOfObjects];
  //     })
  //   );
  // }

  getDetails() {
    return this.http.get(environment.API_Url).pipe(
      map((responseData: any) => {
        if (!responseData) {
          return [];
        }
  
        const keys = Object.keys(responseData);
        const arrayOfObjects = keys.map(key => {
          return { id: key, ...responseData[key] };
        });
  
        console.log('Keys:', keys);
        console.log('Response Data:', responseData);
        console.log('Array of Objects:', arrayOfObjects);
  
        return arrayOfObjects;
      })
    );
  }
  
  

  deleteContact(contact: any): Observable<any> {
    console.log(contact)
    return this.http.delete(`${environment.API_Url}/contactDetails/${contact.id}`);
  }
  
}

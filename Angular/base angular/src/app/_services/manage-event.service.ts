import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '../config/app-config';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ManageEventService {
  constructor(private http: HttpClient) {}

  getAllEventList(data: any) {
    return this.http.post<any>(CONFIG.getAllEventURL, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getEventById(id: number, data) {
    return this.http.post<any>(CONFIG.getEventByIdURL + id, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  updateEvent(data: any) {
    return this.http.post<any>(CONFIG.updateEventURL, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  createEvent(data: any) {
    return this.http.post<any>(CONFIG.createEventURL, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  deleteEvent(id: number, data) {
    return this.http.post<any>(CONFIG.deleteEventURL + id, data).pipe(
      map((response) => {
        return response;
      })
    );
  }
}

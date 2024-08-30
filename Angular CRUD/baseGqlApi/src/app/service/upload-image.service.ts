import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UploadImageService {
  private uploadUrl =
    'https://basenodeapi.demo.brainvire.dev/api/v1/banner/banner-img';
  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    let token = '';
    let accessToken = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token') ?? '';
      accessToken = localStorage.getItem('accessToken') ?? '';
    }

    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : `Bearer ${accessToken}`,
    });

    return this.http
      .post<{ data: { url: string } }>(this.uploadUrl, formData, { headers })
      .pipe(
        map((response) => response.data.url),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error ??'Failed to upload file');
  }
}

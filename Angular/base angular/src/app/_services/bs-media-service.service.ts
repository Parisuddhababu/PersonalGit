import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '../config/app-config';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BsMediaServiceService {
  constructor(private http: HttpClient) {}

  /* get all media */
  getAllMediaFolderAndFile(Items: any) {
    return this.http.post<any>(CONFIG.getAllMediaFolderAndFileURL, Items).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /* create new folder */
  createFolder(Items: any) {
    return this.http.post<any>(CONFIG.createFolderURL, Items).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /* delete media */
  deleteFolder(Items: any) {
    return this.http.post<any>(CONFIG.deleteFolderURL, Items).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /* Upload any type of media */
  uploadBsMedia(Items: any) {
    return this.http.post<any>(CONFIG.uploadBsMediaURL, Items).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /* Re-Name Media */
  renameBsMedia(Items: any) {
    return this.http.post<any>(CONFIG.renameBsMediaURL, Items).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /* move media to another folder */
  moveBsMedia(Items: any) {
    return this.http.post<any>(CONFIG.moveBsMediaURL, Items).pipe(
      map((response) => {
        return response;
      })
    );
  }
}

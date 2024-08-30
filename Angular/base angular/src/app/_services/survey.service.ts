import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { CONFIG } from '../config/app-config';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  constructor(private http: HttpClient) { }

  getSurveyList(SurveyData: any) {
    return this.http.post<any>(CONFIG.getSurveyListURL, SurveyData).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getSurveyDetailsById(id: number) {
    return this.http.get<any>(CONFIG.getSurveyDetailsByIdURL + id).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getSurveyById(id: number) {
    return this.http.get<any>(CONFIG.getSurveyByIdURL + id).pipe(
      map((data) => {
        return data;
      })
    );
  }

  updateSurvey(SurveyData: any) {
    return this.http.put<any>(CONFIG.updateSurveyURL, SurveyData).pipe(
      map((response) => {
        return response;
      })
    );
  }

  createSurvey(SurveyData) {
    return this.http.post<any>(CONFIG.createSurveyURL, SurveyData).pipe(
      map((response) => {
        return response;
      })
    );
  }

  changeSurveyStatus(status: string, id: number) {
    return this.http
      .post<any>(CONFIG.changeSurveyStatusURL, { survey_uuid: id, status: status })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  deleteSurvey(id: number) {
    return this.http.delete<any>(CONFIG.deleteSurveyURL + id).pipe(
      map((response) => {
        return response;
      })
    );
  }
  createSurveyQuesAns(formdata) {
    return this.http.post<any>(CONFIG.createSurveyQuestionsURL, formdata).pipe(
      map((response) => {
        return response;
      })
    );
  }
  updateSurveyQuesAns(formdata) {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    return this.http.put<any>(CONFIG.updateSurveyQuestionsURL, this.formDataToEncodedFormDataConvertor(formdata).toString(), options).pipe(
      map((response) => {
        return response;
      })
    );
  }
  getSurveyQuesAnsById(id: number) {
    return this.http.get<any>(CONFIG.getSurveyQuesAnsByIdURL + id).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getAnswerForTextType(SurveyData: any) {
    return this.http.post<any>(CONFIG.getAnswerForTextTypeURL, SurveyData).pipe(
      map((response) => {
        return response;
      })
    );
  }
  getAnswerForSingleMultipleType(SurveyData: any) {
    return this.http.post<any>(CONFIG.getAnswerForSingleMultipleTypeURL, SurveyData).pipe(
      map((response) => {
        return response;
      })
    );
  }
  // User Survey
  getActiveSurveyList(SurveyData: any) {
    return this.http.post<any>(CONFIG.getActiveSurveyListURL, SurveyData).pipe(
      map((response) => {
        return response;
      })
    );
  }
  updateUserSurveyAns(formdata) {
    return this.http.post<any>(CONFIG.updateUserSurveyAnsURL, formdata).pipe(
      map((response) => {
        return response;
      })
    );
  }
  getAnswerDetailsById(id: number) {
    return this.http.get<any>(CONFIG.getAnswerDetailsByIdURL + id).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getSurveyUserReport(SurveyData: any) {
    return this.http.post<any>(CONFIG.getSurveyUserReportURL, SurveyData).pipe(
      map((response) => {
        return response;
      })
    );
  }
  notifySurveyUserReport(userData: any) {
    return this.http.post<any>(CONFIG.notifySurveyUserURL, userData).pipe(
      map((response) => {
        return response;
      })
    );
  }
  private formDataToEncodedFormDataConvertor(formData) {
    const body = new URLSearchParams();
    for (const pair of formData.entries()) {
      body.set(pair[0], pair[1]);
    }
    return body;
  }
}

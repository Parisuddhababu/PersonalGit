import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '../config/app-config';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RulesetService {
  constructor(private http: HttpClient) {}

  getRulesetList(data: any) {
    return this.http.post<any>(CONFIG.getRulesetListURL, data).pipe(
      map((response) => {
        return response;
      })
    );
  }
  createRuleset(data: any) {
    return this.http.post<any>(CONFIG.createRulesetURL, data).pipe(
      map((response) => {
        return response;
      })
    );
  }
  updateRuleset(data: any) {
    return this.http.post<any>(CONFIG.updateRulesetURL, data).pipe(
      map((response) => {
        return response;
      })
    );
  }
  getRulesetById(data: any) {
    return this.http.post<any>(CONFIG.getRulesetByIdURL, data).pipe(
      map((response) => {
        return response;
      })
    );
  }
  changeRulesetStatus(data: any) {
    return this.http.post<any>(CONFIG.changeRulesetStatusURL, data).pipe(
      map((response) => {
        return response;
      })
    );
  }
  deleteRuleset(data: any) {
    return this.http.post<any>(CONFIG.deleteRulesetURL, data).pipe(
      map((response) => {
        return response;
      })
    );
  }
}

import { TestBed } from '@angular/core/testing';
import { SurveyService } from './survey.service';

describe('SurveyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SurveyService = TestBed.inject(SurveyService);
    expect(service).toBeTruthy();
  });
});

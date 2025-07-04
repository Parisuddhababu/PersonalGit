import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SurveyReportComponent } from './survey-report.component';

describe('SurveyReportComponent', () => {
  let component: SurveyReportComponent;
  let fixture: ComponentFixture<SurveyReportComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SurveyReportComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SurveyAnswersComponent } from './survey-answers.component';

describe('SurveyAnswersComponent', () => {
  let component: SurveyAnswersComponent;
  let fixture: ComponentFixture<SurveyAnswersComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SurveyAnswersComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

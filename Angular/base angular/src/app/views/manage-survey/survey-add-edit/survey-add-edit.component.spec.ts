import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SurveyAddEditComponent } from './survey-add-edit.component';

describe('SurveyAddEditComponent', () => {
  let component: SurveyAddEditComponent;
  let fixture: ComponentFixture<SurveyAddEditComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SurveyAddEditComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

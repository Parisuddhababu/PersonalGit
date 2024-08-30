import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserSurveyComponent } from './user-survey.component';

describe('UserSurveyComponent', () => {
  let component: UserSurveyComponent;
  let fixture: ComponentFixture<UserSurveyComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [UserSurveyComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserSurveyListComponent } from './user-survey-list.component';

describe('UserSurveyListComponent', () => {
  let component: UserSurveyListComponent;
  let fixture: ComponentFixture<UserSurveyListComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [UserSurveyListComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSurveyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

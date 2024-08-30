import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmailAddEditComponent } from './email-add-edit.component';

describe('EmailAddEditComponent', () => {
  let component: EmailAddEditComponent;
  let fixture: ComponentFixture<EmailAddEditComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [EmailAddEditComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

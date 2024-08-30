import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FaqAddEditComponent } from './faq-add-edit.component';

describe('FaqAddEditComponent', () => {
  let component: FaqAddEditComponent;
  let fixture: ComponentFixture<FaqAddEditComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [FaqAddEditComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubadminAddEditComponent } from './subadmin-add-edit.component';

describe('SubadminAddEditComponent', () => {
  let component: SubadminAddEditComponent;
  let fixture: ComponentFixture<SubadminAddEditComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SubadminAddEditComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SubadminAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

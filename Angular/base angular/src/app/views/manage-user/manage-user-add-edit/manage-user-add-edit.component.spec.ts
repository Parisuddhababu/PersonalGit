import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManageUserAddEditComponent } from './manage-user-add-edit.component';

describe('ManageUserAddEditComponent', () => {
  let component: ManageUserAddEditComponent;
  let fixture: ComponentFixture<ManageUserAddEditComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ManageUserAddEditComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUserAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

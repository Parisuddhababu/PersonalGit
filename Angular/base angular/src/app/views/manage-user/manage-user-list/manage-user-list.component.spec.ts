import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManageUserListComponent } from './manage-user-list.component';

describe('ManageUserListComponent', () => {
  let component: ManageUserListComponent;
  let fixture: ComponentFixture<ManageUserListComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ManageUserListComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManageLocationComponent } from './manage-location.component';

describe('ManageLocationComponent', () => {
  let component: ManageLocationComponent;
  let fixture: ComponentFixture<ManageLocationComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ManageLocationComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

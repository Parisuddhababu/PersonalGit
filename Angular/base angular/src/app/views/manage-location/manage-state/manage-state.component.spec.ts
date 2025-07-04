import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManageStateComponent } from './manage-state.component';

describe('ManageStateComponent', () => {
  let component: ManageStateComponent;
  let fixture: ComponentFixture<ManageStateComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ManageStateComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManageEventComponent } from './manage-event.component';

describe('ManageEventComponent', () => {
  let component: ManageEventComponent;
  let fixture: ComponentFixture<ManageEventComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ManageEventComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

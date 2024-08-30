import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EventAddEditComponent } from './event-add-edit.component';

describe('EventAddEditComponent', () => {
  let component: EventAddEditComponent;
  let fixture: ComponentFixture<EventAddEditComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [EventAddEditComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EventAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubadminComponent } from './subadmin.component';

describe('SubadminComponent', () => {
  let component: SubadminComponent;
  let fixture: ComponentFixture<SubadminComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SubadminComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SubadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

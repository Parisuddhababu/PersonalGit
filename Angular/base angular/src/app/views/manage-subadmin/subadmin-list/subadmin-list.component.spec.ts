import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubadminListComponent } from './subadmin-list.component';

describe('SubadminListComponent', () => {
  let component: SubadminListComponent;
  let fixture: ComponentFixture<SubadminListComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SubadminListComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SubadminListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

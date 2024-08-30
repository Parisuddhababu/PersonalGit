import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CmsAddEditComponent } from './cms-add-edit.component';

describe('CmsAddEditComponent', () => {
  let component: CmsAddEditComponent;
  let fixture: ComponentFixture<CmsAddEditComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CmsAddEditComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CmsAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

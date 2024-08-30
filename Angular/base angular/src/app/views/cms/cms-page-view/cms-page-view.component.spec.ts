import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CmsPageViewComponent } from './cms-page-view.component';

describe('CmsPageViewComponent', () => {
  let component: CmsPageViewComponent;
  let fixture: ComponentFixture<CmsPageViewComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CmsPageViewComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CmsPageViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

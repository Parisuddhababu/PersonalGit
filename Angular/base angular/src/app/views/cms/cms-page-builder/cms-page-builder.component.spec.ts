import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CmsPageBuilderComponent } from './cms-page-builder.component';

describe('CmsPageBuilderComponent', () => {
  let component: CmsPageBuilderComponent;
  let fixture: ComponentFixture<CmsPageBuilderComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CmsPageBuilderComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CmsPageBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

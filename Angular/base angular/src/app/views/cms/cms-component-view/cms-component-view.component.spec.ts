import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CmsComponentViewComponent } from './cms-component-view.component';

describe('CmsComponentViewComponent', () => {
  let component: CmsComponentViewComponent;
  let fixture: ComponentFixture<CmsComponentViewComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CmsComponentViewComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CmsComponentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CountryAddEditComponent } from './country-add-edit.component';

describe('CountryAddEditComponent', () => {
  let component: CountryAddEditComponent;
  let fixture: ComponentFixture<CountryAddEditComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CountryAddEditComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

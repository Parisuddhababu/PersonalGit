import { TestBed } from '@angular/core/testing';
import { MultilingualService } from './multilingual.service';

describe('MultilingualService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MultilingualService = TestBed.inject(MultilingualService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';
import { RulesetService } from './ruleset.service';

describe('RulesetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RulesetService = TestBed.inject(RulesetService);
    expect(service).toBeTruthy();
  });
});

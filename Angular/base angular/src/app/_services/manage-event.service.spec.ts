import { TestBed } from '@angular/core/testing';
import { ManageEventService } from './manage-event.service';

describe('ManageEventService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManageEventService = TestBed.inject(ManageEventService);
    expect(service).toBeTruthy();
  });
});

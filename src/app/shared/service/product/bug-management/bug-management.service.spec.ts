import { TestBed } from '@angular/core/testing';

import { BugManagementService } from './bug-management.service';

describe('BugManagementService', () => {
  let service: BugManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BugManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

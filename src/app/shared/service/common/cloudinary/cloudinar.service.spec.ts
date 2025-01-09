import { TestBed } from '@angular/core/testing';

import { CloudinarService } from './cloudinar.service';

describe('CloudinarService', () => {
  let service: CloudinarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CloudinarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

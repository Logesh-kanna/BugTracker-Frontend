import { TestBed } from '@angular/core/testing';

import { ScreensizeGuard } from './screensize.guard';

describe('ScreensizeGuard', () => {
  let guard: ScreensizeGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ScreensizeGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

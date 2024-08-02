import { TestBed } from '@angular/core/testing';

import { ReplacementService } from './replacement.service';

describe('ReplacementService', () => {
  let service: ReplacementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReplacementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

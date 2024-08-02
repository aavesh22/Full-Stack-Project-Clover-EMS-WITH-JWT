import { TestBed } from '@angular/core/testing';

import { NewRequirementService } from './new-requirement.service';

describe('NewRequirementService', () => {
  let service: NewRequirementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewRequirementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

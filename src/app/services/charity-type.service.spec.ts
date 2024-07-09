import { TestBed } from '@angular/core/testing';

import { CharityTypeService } from './charity-type.service';

describe('CharityTypeService', () => {
  let service: CharityTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CharityTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

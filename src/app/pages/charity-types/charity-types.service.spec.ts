import { TestBed } from '@angular/core/testing';

import { CharityTypesService } from './charity-types.service';

describe('CharityTypesService', () => {
  let service: CharityTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CharityTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

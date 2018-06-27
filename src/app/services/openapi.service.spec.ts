import { TestBed, inject } from '@angular/core/testing';

import { OpenapiService } from './openapi.service';

describe('OpenapiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OpenapiService]
    });
  });

  it('should be created', inject([OpenapiService], (service: OpenapiService) => {
    expect(service).toBeTruthy();
  }));
});

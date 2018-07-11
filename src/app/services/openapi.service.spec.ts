import { TestBed, inject } from '@angular/core/testing';

import { OpenApiService } from './openapi.service';

describe('OpenapiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OpenApiService]
    });
  });

  it('should be created', inject([OpenApiService], (service: OpenApiService) => {
    expect(service).toBeTruthy();
  }));
});

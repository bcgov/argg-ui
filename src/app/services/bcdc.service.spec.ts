import { TestBed, inject } from '@angular/core/testing';

import { BcdcService } from './bcdc.service';

describe('BcdcService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BcdcService]
    });
  });

  it('should be created', inject([BcdcService], (service: BcdcService) => {
    expect(service).toBeTruthy();
  }));
});

import { TestBed, inject } from '@angular/core/testing';

import { ArggService } from './argg.service';

describe('ArggService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArggService]
    });
  });

  it('should be created', inject([ArggService], (service: ArggService) => {
    expect(service).toBeTruthy();
  }));
});

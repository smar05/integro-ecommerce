import { TestBed } from '@angular/core/testing';

import { UrlShopsService } from './url-shops.service';

describe('UrlShopsService', () => {
  let service: UrlShopsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UrlShopsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

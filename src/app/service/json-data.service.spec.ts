import { TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

import { JsonDataService } from './json-data.service';

describe('JsonDataService', () => {
  let service: JsonDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],  
    });
    service = TestBed.inject(JsonDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

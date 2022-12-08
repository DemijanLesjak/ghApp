import { TestBed } from '@angular/core/testing';

import { ExchangeRateService } from './exchange-rate.service';
import { HttpClientModule } from '@angular/common/http';

describe('ExchangeRateService', () => {
  let service: ExchangeRateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
      ]
    });
    service = TestBed.inject(ExchangeRateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

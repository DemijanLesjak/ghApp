import { Component } from '@angular/core';
import { ExchangeRateService } from './services/exchange-rate.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'gatehubApp';
  rate: number | undefined;

  constructor(public exchangeRateService: ExchangeRateService) {
  }

  ngOnInit() {
    this.exchangeRateService.getExchangeRate('GBP', 'USD').subscribe((rate: number) => {
      console.log('new rate', rate);
      this.rate = rate;
    });
  }

}

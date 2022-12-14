import { Component } from '@angular/core';
import { ExchangeRateService } from './services/exchange-rate.service';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';

interface CurrencyFormGroup {
  amount: FormControl<number>;
  currencyFrom: FormControl<string>;
  currencyTo: FormControl<string>;
}

export enum State {
  loading,
  loaded,
  error
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'gatehubApp';
  rate: number | undefined;
  state: State = State.loading;
  chartData: {date: string, rate: number}[] = [];
  today: string = new Date().toISOString().slice(0, 10);
  switchingCurrencies: boolean = false;

  currencyForm: FormGroup<CurrencyFormGroup> = this._fb.group({
    amount: [100, [Validators.required, Validators.min(0)]],
    currencyFrom: ['USD'],
    currencyTo: ['EUR']
  });

  constructor(public exchangeRateService: ExchangeRateService,
              private _fb: NonNullableFormBuilder) {
  }

  ngOnInit() {
    this.refreshExchangeRate(
      this.currencyForm.controls['currencyFrom'].value,
      this.currencyForm.controls['currencyTo'].value);

    this.currencyForm.controls.currencyTo.valueChanges.subscribe((value: string) => {
      if (this.switchingCurrencies) {
        return;
      }
      this.refreshExchangeRate(this.currencyForm.controls['currencyFrom'].value, value);
    });

    this.currencyForm.controls.currencyFrom.valueChanges.subscribe((value: string) => {
      if (this.switchingCurrencies) {
        return;
      }
      this.refreshExchangeRate(value, this.currencyForm.controls['currencyTo'].value);
    });

  }

  toggleSymbols() {
    this.switchingCurrencies = true;
    const tempFrom: string = this.currencyForm.controls.currencyFrom.value;
    const tempTo: string = this.currencyForm.controls.currencyTo.value;
    this.currencyForm.controls.currencyTo.setValue(tempFrom);
    this.currencyForm.controls.currencyFrom.setValue(tempTo);
    this.refreshExchangeRate(tempTo, tempFrom);
    this.switchingCurrencies = false;
  }

  /**
   * It retreive fresh data for new selected currencies.
   * @param from
   * @param to
   */
  refreshExchangeRate(from: string, to: string) {
    this.state = State.loading;
    this.exchangeRateService.getExchangeRate(
      from, to).subscribe(
      (rate: number) => {
        this.rate = rate;
        this.state = State.loaded;
      },
      error => {
        this.state = State.error;
      }
    );

    this.exchangeRateService.getHistoryData(from, to).subscribe((value: {date: string, rate: number}[]) => {
      this.chartData = value;
    });
  }

}

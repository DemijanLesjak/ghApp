import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { exchangeRateApiDomain } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {
  supportedSymbols: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  constructor(public http: HttpClient) {
    this.getSupportedSymbols();
  }

  /**
   * Retreive all available symbols. Assign mapped value of arrays of strings to
   * BehaviourSubject.
   */
  getSupportedSymbols() {
    this.http.get(`${exchangeRateApiDomain}/symbols`).pipe(
      map((res: any) => {
        const symbols: string[] = [];
        for (const code in res.symbols) {
          symbols.push(code);
        }

        return symbols;
      })
    ).subscribe((res: string[]) => {
      this.supportedSymbols.next(res);
    });
  }

  /**
   * Get current exchange rate between two currencies.
   * @param {string} from
   * @param {string} to
   * @return {Observable<number>}
   */
  getExchangeRate(from: string, to: string): Observable<number> {
    return this.http.get(`${exchangeRateApiDomain}/convert?from=${from}&to=${to}`).pipe(
      map((res: any) => {
        return res.info.rate;
      })
    );
  }

  /**
   * Get historic data for year to date. Then it exctracts only last 6 values needed for chart and map it to array.
   * Maybe it would be better to put direct date values to endpoint params, anyway I have used provided URL.
   * @param {string} from
   * @param {string} to
   * @return {Observable<{date: string, rate: number}[]>}
   */
  getHistoryData(from: string, to: string): Observable<{date: string, rate: number}[]> {
    return this.http.get(`${exchangeRateApiDomain}/timeseries?start_date=2022-01-01&end_date=2023-01-01&base=${from}&symbols=${to}`)
      .pipe(
        map((res: any) => {
          const allRates: {date: string, rate: number}[] = [];
          for (const date in res.rates) {
            allRates.push({ date: date, rate: res.rates[date][to] });
          }
          // In the array find index of today's rate
          const index = allRates.findIndex(item => {
            return item.date === new Date().toISOString().slice(0, 10);
          });

          // From the index substract 5 days.
          let startIndex = index - 6;
          const rates: {date: string, rate: number}[] = [];

          // From all rates filter only last 6 needed for the chart.
          for (let i = 0; i < 6; i++) {
            rates.push(allRates[startIndex]);
            startIndex++;
          }

          return rates;
        })
      );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {
  supportedSymbols: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  constructor(public http: HttpClient) {
    this.getSupportedSymbols();
  }

  getSupportedSymbols() {
    this.http.get('https://api.exchangerate.host/symbols').pipe(
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

  getExchangeRate(from: string, to: string): Observable<number> {
    return this.http.get(`https://api.exchangerate.host/convert?from=${from}&to=${to}`).pipe(
      map((res: any) => {
        return res.info.rate;
      })
    );
  }
}

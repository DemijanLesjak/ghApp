import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { filter, fromEvent, map, merge, Observable, scan, Subject, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-currency-dropdown',
  templateUrl: './currency-dropdown.component.html',
  styleUrls: ['./currency-dropdown.component.scss'],
})
export class CurrencyDropdownComponent implements OnInit {
  options: string[] = ['BTC', 'BTK', 'CZK', 'XRP', 'EUR', 'DOT', 'ETH'];
  selection: string = this.options[0];
  activeValue: string = '';
  closed: boolean = true;
  mouseHovered: boolean = false;
  keyDown$ = fromEvent<KeyboardEvent>(document, 'keydown');
  reset$: Subject<string> = new Subject();

  toggleDropdownList() {
    this.closed = !this.closed;
  }

  ngOnInit() {
    this.autocompleteHandler();
  }

  /**
   * Subscribe to key events and search through dropdown values.
   */
  autocompleteHandler() {
    const enteredKey$: Observable<string> = this.keyDown$.pipe(
      filter((res: KeyboardEvent) => {
        return !this.closed;
      }),
      tap((res: KeyboardEvent) => {
        console.log(res);
      }),
      map((res: KeyboardEvent) => {
        if (res.key === 'Enter') {
          this.selectValue(this.activeValue);
          return '';
        }
        return res.key;
      })
    );

    // Merge enteredKey and reset streams. If reset is fired empty string will enter scan and reset values
    merge(
      enteredKey$,
      this.reset$).pipe(
      scan((acc: string, curr: string, index) => {
        if (curr === '') {
          acc = curr;
          return acc;
        }
        acc = acc + curr;
        return acc;
      }),
      untilDestroyed(this),
    ).subscribe((searchVal: string) => {
      if (searchVal) {
        this.activeValue = this.options.filter((item) => {
          const tempValue = item.slice(0, searchVal.length);
          return tempValue.toLowerCase() === searchVal.toLowerCase();
        })[0];
        this.resetAutocomplete();
      }
    });
  }

  resetAutocomplete() {
    setTimeout(() => {
      this.reset$.next('');
    }, 1000);
  }

  selectValue(symbol: string) {
    this.selection = symbol;
    this.toggleDropdownList();
  }

  move() {
    console.log('movvving');

  }

  activateMouse() {
    this.activeValue = '';
    this.mouseHovered = true;
  }

  mouseInactivate() {
    this.mouseHovered = false;
  }
}

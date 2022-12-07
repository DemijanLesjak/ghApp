import {
  Inject,
  Component,
  ElementRef,
  Input,
  OnInit,
} from '@angular/core';
import { filter, fromEvent, map, merge, Observable, scan, Subject, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ExchangeRateService } from '../../services/exchange-rate.service';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';

@UntilDestroy()
@Component({
  selector: 'app-currency-dropdown',
  templateUrl: './currency-dropdown.component.html',
  styleUrls: ['./currency-dropdown.component.scss'],
})
export class CurrencyDropdownComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() controlName!: string;

  options: string[] = [];
  activeValue: string = '';
  closed: boolean = true;
  typing: boolean = false;
  keyDown$ = fromEvent<KeyboardEvent>(document, 'keydown');
  reset$: Subject<string> = new Subject();
  // represents document object to access elements for scrollIntoView.
  doc: any;

  constructor(public exchangeRate: ExchangeRateService,
              public router: Router,
              public el: ElementRef,
              @Inject(DOCUMENT) doc: any) {
    this.doc = doc;
  }

  c(): FormControl {
    return this.form.get(this.controlName) as FormControl;
  }

  toggleDropdownList() {
    this.closed = !this.closed;
  }

  ngOnInit() {
    this.autocompleteHandler();

    this.exchangeRate.supportedSymbols.pipe(
      untilDestroyed(this)
    ).subscribe((symbols: string[]) => {
      this.options = symbols;
    });
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
        this.typing = true;
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
        this.scrollToSelection(this.activeValue);
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
    this.c().setValue(symbol);
    this.toggleDropdownList();
  }

  // Scroll to selected symbol if using keyboard
  scrollToSelection(symbol: string) {
    const index = this.options.indexOf(symbol);
    if (index < 0) {
      return;
    }
    this.doc.getElementById(`item-${index}`).scrollIntoView();
  }

  mouseMove() {
    this.activeValue = '';
    this.typing = false;
  }

}

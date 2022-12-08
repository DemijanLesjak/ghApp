import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ExchangeRateService } from './services/exchange-rate.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CurrencyDropdownComponent } from './components/currency-dropdown/currency-dropdown.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { HighchartsChartModule } from 'highcharts-angular';
import { ChartComponent } from './components/chart/chart.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MatIconModule,
        HttpClientModule,
        ReactiveFormsModule,
        HighchartsChartModule
      ],
      providers: [ExchangeRateService],
      declarations: [
        AppComponent,
        CurrencyDropdownComponent,
        ChartComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});

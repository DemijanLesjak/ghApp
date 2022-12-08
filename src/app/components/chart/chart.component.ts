import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ExchangeRateService } from '../../services/exchange-rate.service';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  @Input() data: {date: string, rate: number}[] = [];
  Highcharts: typeof Highcharts = Highcharts;
  updateFlag = false;
  chartOptions: Highcharts.Options = {
    series:[
      {
        type: 'line',
        data: [],
      }
    ],
    xAxis: [{ categories: [] }],
    title: {
      text: ''
    },
    yAxis: {
      title: {
        text: null
      }
    },
    legend: {
      enabled: false
    }
  };
  constructor(public exchangeRate: ExchangeRateService) {
  }

  get dates(): string[] {
    return this.data.map(item => {
      return item.date;
    });
  }

  get rates(): number[] {
    return this.data.map(item => {
      return item.rate;
    });
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.chartOptions.series![0] = {
      type: 'line',
      data: this.rates,
      color: '#9d178f'
    };
    this.chartOptions.xAxis = {
      categories: this.dates
    };
    this.updateFlag = true;
  }
}

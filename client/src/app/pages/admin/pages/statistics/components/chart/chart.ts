import { Component, effect, input, signal, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChartEvent } from 'node_modules/chart.js/dist/core/core.plugins';

@Component({
  selector: 'app-chart',
  imports: [BaseChartDirective],
  templateUrl: './chart.html',
  styleUrl: './chart.css',
})
export class Chart {
  data = input<{ [key: string]: number }>({});
  label = input<string>('');

  @ViewChild(BaseChartDirective) chart: BaseChartDirective<'bar'> | undefined;

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    scales: {
      x: {},
      y: {
        min: 0,
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: { textAlign: 'center' },
      },
    }
  };

  public barChartType = 'bar' as const;

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], label: this.label(), backgroundColor: '#51a2ff' }],
  };

  constructor() {
    effect(() => {
      if (this.data()) {
        this.barChartData.labels = Object.keys(this.data());
        this.barChartData.datasets[0].data = Object.values(this.data());

        setTimeout(() => {
          this.chart?.update();
        });
      }
    });
  }

  public chartClicked({ event, active }: { event?: ChartEvent; active?: object[] }): void {}
  public chartHovered({ event, active }: { event?: ChartEvent; active?: object[] }): void {}
}

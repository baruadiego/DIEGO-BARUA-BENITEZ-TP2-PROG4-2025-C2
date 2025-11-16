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
  axisXLabel = input<string>('');
  type = input<'bar' | 'line'>('bar');

  @ViewChild(BaseChartDirective) chart: BaseChartDirective<'bar'> | undefined;

  public barChartOptions: ChartConfiguration<'bar' | 'line'>['options'] = {
    scales: {
      x: {
        title: {
          display: true,
          text: this.axisXLabel(),
          font: {
            size: 14,
            weight: 'bold',
          }
        }
      },
      y: {
        min: 0,
        beginAtZero: true,
        ticks: { stepSize: 2 },
        title: {
          display: true,
          text: 'Cantidad',
          font: {
            size: 14,
            weight: 'bold',
          }
        }
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: { textAlign: 'center', font: { size: 14, weight: 'bold' } },
      },
    }
  };

  public barChartType = 'bar' as const;

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], label: this.label(), backgroundColor: '#51a2ff', borderColor: '#51a2ff' }],
  };

  constructor() {
    effect(() => {
      if (this.data()) {
        this.barChartData.labels = Object.keys(this.data());
        this.barChartData.datasets[0].data = Object.values(this.data());
        this.barChartData.datasets[0].label = this.label();

        this.barChartOptions!.scales!['x']!.title!.text = this.axisXLabel();
        setTimeout(() => {
          const opts = this.chart!.chart!.options;

          if (opts.scales && opts.scales['x'] && opts.scales['x'].title) {
            opts.scales['x'].title!.text = this.axisXLabel();
          }
          this.chart?.update();
        });
      }
    });
  }

  public chartClicked({ event, active }: { event?: ChartEvent; active?: object[] }): void {}
  public chartHovered({ event, active }: { event?: ChartEvent; active?: object[] }): void {}
}

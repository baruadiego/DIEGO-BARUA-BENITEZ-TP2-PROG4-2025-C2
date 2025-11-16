import { Component, inject, LOCALE_ID, signal } from '@angular/core';
import { StatsService } from 'src/app/common/services/stats-service';
import { Chart } from './components/chart/chart';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormField } from '@angular/material/form-field';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { dateRangeValidator } from 'src/app/common/validators/dateRange.validator';
import { UserService } from 'src/app/common/services/user-service';
import { PostService } from 'src/app/common/services/post-service';
import { User } from 'src/app/common/types/user';
import { Post } from 'src/app/common/types/post';
import { groupBy } from 'rxjs';
import { getDiference } from 'src/app/common/helpers/statistics';

@Component({
  selector: 'app-statistics',
  imports: [
    Chart,
    MatDatepickerModule,
    MatFormField,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './statistics.html',
  styleUrl: './statistics.css',
  providers: [
    provideNativeDateAdapter(),
    { provide: LOCALE_ID, useValue: 'es-AR' },
    { provide: MAT_DATE_LOCALE, useValue: 'es-AR' },
  ],
})
export class statistics {
  statService = inject(StatsService);

  static = signal<{ [key: string]: number }>({});
  typeOfChart = signal<'bar' | 'line'>('line');
  filter = signal<'posts' | 'comments' | ''>('');
  title = signal<string>('');
  label = signal<string>('Publicaciones');
  axisXLabel = signal<string>('Día del Mes');

  minDate = new Date(2023, 0, 1); // 1 de enero de 2023
  maxDate = new Date();

  filterForm = new FormGroup({
    fromDate: new FormControl('', [Validators.required, dateRangeValidator(this.minDate, this.maxDate)]),
    toDate: new FormControl('', [Validators.required, dateRangeValidator(this.minDate, this.maxDate)]),
    type: new FormControl('', [Validators.required, Validators.pattern('^(posts|comments)$')]),
    groupBy: new FormControl(''),
  });

  constructor() {
    const today = new Date();
    const oneMonthAgo = new Date(
      today.getFullYear(), today.getMonth() - 1, today.getDate()
    );

    this.title.set('Publicaciones desde el ' + oneMonthAgo.toLocaleDateString('es-ES') + ' hasta el ' + today.toLocaleDateString('es-ES'));

    this.statService
      .getPostStat({
        startDate: oneMonthAgo.toISOString(),
        endDate: today.toISOString(),
        groupBy: 'dayOfMonth',
      })
      .subscribe((res) => {
        if (res) {
          this.static.set(res);
        }
      });
  }

  changeFilter() {
    this.filter.set(this.filterForm.value.type as 'posts' | 'comments' | '');
    this.filterForm.get('groupBy')?.setValue('');
  }

  updateTitle(){
    const fromDate = new Date(this.filterForm.value.fromDate!).toLocaleDateString('es-ES');
    const toDate = new Date(this.filterForm.value.toDate!).toLocaleDateString('es-ES');

    let title = (this.filter() === 'posts' ? 'Publicaciones' : 'Comentarios') + ' desde el ' + fromDate + ' hasta el ' + toDate;

    if(this.filterForm.value.groupBy && this.filterForm.value.groupBy !== ''){
      title += ' agrupados por ' + (this.filterForm.value.groupBy === 'user' ? 'usuarios' : 'titulos de publicaciones');
    }

    return title;
  }

  changeAxisLabel(groupBy: string) {
    
    switch (groupBy) {
      case 'year':
        this.axisXLabel.set('Año');
        break;
      case 'month':
        this.axisXLabel.set('Mes');
        break;
      case 'dayOfMonth':
        this.axisXLabel.set('Día del Mes');
        break;
      case 'day':
        this.axisXLabel.set('Día de la Semana');
        break;
      case 'user':
        this.axisXLabel.set('Username');
        break;
      case 'post':
        this.axisXLabel.set('Título de la Publicación');
        break;
    }

  }

  getStat(){
    const data = this.filterForm.value;
    data.toDate = new Date(new Date(data.toDate!).setHours(23,59,59,999)).toISOString().split('T')[0];

    this.title.set(this.updateTitle());

    if(data.groupBy === ''){
      this.typeOfChart.set('line');
      data.groupBy = getDiference(data.fromDate!, data.toDate!);
    }else {
      this.typeOfChart.set('bar');
    }

    this.changeAxisLabel(data.groupBy!);
    
    if (this.filter() === 'posts') {
      this.label.set('Publicaciones');
    } else if (this.filter() === 'comments') {
      this.label.set('Comentarios');
    }

    if(this.filter() === 'comments'){
      this.statService
        .getCommentStat({
          startDate: data.fromDate!,
          endDate: data.toDate!,
          groupBy: data.groupBy!,
        })
        .subscribe((res) => {
          if (res) {
            this.static.set(res);
          }
        });
    }else if(this.filter() === 'posts'){
      this.statService
        .getPostStat({
          startDate: data.fromDate!,
          endDate: data.toDate!,
          groupBy: data.groupBy!,
        })
        .subscribe((res) => {
          if (res) {
            this.static.set(res);
          }
        });
    }

  }
}

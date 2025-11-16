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
  userService = inject(UserService);
  postService = inject(PostService);

  static = signal<{ [key: string]: number }>({});
  filter = signal<'posts' | 'comments' | ''>('');
  users = signal<User[]>([]);
  posts = signal<Post[]>([]);
  minDate = new Date(2023, 0, 1); // 1 de enero de 2023
  maxDate = new Date();

  filterForm = new FormGroup({
    fromDate: new FormControl('', [Validators.required, dateRangeValidator(this.minDate, this.maxDate)]),
    toDate: new FormControl('', [Validators.required, dateRangeValidator(this.minDate, this.maxDate)]),
    type: new FormControl('', [Validators.required, Validators.pattern('^(posts|comments)$')]),
    filter: new FormControl(''),
  });

  constructor() {
    this.userService.getUsers().subscribe((res) => {
      if (res) {
        this.users.set(res);
      }
    })

    this.postService.getAllPosts().subscribe((res) => {
      if (res) {
        this.posts.set(res.posts!);
      }
    })

    this.statService
      .getCommentStat({
        userId: '69027b008beb1737f38e4a3f',
        startDate: '2025-11-01',
        endDate: '2025-11-01',
        groupBy: 'dayOfMonth',
      })
      .subscribe((res) => {
        if (res) {
          this.static.set(res);
        }
      });
  }

  actualizar() {
    this.statService
      .getCommentStat({
        userId: '69027b008beb1737f38e4a3f',
        startDate: '2025-11-01',
        endDate: '2025-11-01',
        groupBy: 'day',
      })
      .subscribe((res) => {
        if (res) {
          this.static.set(res);
        }
      });
  }

  changeFilter() {
    this.filter.set(this.filterForm.value.type as 'posts' | 'comments' | '');
  }

  getStat(){
    console.log(this.filterForm.value);
    const data = this.filterForm.value;

    if(this.filter() === 'comments'){
      this.statService
        .getCommentStat({
          postId: data.filter!,
          startDate: data.fromDate!,
          endDate: data.toDate!,
          groupBy: 'dayOfMonth',
        })
        .subscribe((res) => {
          if (res) {
            this.static.set(res);
          }
        });
    }else if(this.filter() === 'posts'){
      this.statService
        .getPostStat({
          userId: data.filter!,
          startDate: data.fromDate!,
          endDate: data.toDate!,
          groupBy: 'year',
        })
        .subscribe((res) => {
          if (res) {
            this.static.set(res);
          }
        });
    }

  }
}

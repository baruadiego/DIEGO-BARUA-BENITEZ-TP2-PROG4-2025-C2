import { inject, Injectable } from '@angular/core';
import { StatDto } from '../types/stat';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { ApiResponse } from '../types/apiResponse';
import { catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  http = inject(HttpClient);
  getPostStat(stat: StatDto) {
    return this.http
      .post<ApiResponse>(`${environment.API_URL}/stats/posts`, stat, { withCredentials: true })
      .pipe(
        map((res) => {
          if (res.statusCode === 200 || res.statusCode === 201) {
            return res.data;
          }
          return null;
        }),
        catchError(() => of(null))
      );
  }

  getCommentStat(stat: StatDto) {
    return this.http
      .post<ApiResponse>(`${environment.API_URL}/stats/comments`, stat, { withCredentials: true })
      .pipe(
        map((res) => {
          if (res.statusCode === 200 || res.statusCode === 201) {
            return res.data;
          }
          return null;
        }),
        catchError(() => of(null))
      );
  }
}

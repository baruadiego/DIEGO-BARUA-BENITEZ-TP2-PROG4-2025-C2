import { inject, Injectable, signal } from '@angular/core';
import { User } from '../types/user';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { catchError, map, of } from 'rxjs';
import { ApiResponse } from '../types/apiResponse';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  http = inject(HttpClient);

  getUser(): User | null {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user;
  }

  getUserData(id: string) {
    return this.http
      .get<ApiResponse<User>>(`${environment.API_URL}/users/${id}`, { withCredentials: true })
      .pipe(
        map((res) => {
          return res.statusCode === 200 || res.statusCode === 201 ? res.data! : null;
        }),
        catchError(() => of(null))
      );
  }
}

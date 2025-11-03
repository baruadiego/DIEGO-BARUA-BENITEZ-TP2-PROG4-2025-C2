import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of, map, Subscription } from 'rxjs';
import { environment } from '@env/environment';
import { ApiResponse } from '../types/apiResponse';
import { User } from '../types/user';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  http = inject(HttpClient);
  user = signal<User | null>(null);

  isAuthenticated(): Observable<boolean> {
    return this.http.post<any>(`${environment.API_URL}/auth`, {}, { withCredentials: true }).pipe(
      map((res) => res.statusCode === 200),
      catchError(() =>
        this.http
          .post<any>(`${environment.API_URL}/auth/refresh`, {}, { withCredentials: true })
          .pipe(
            map((res) => res.statusCode === 201 || res.statusCode === 200),
            catchError(() => of(false))
          )
      )
    );
  }

  login(identifier: string, password: string): Observable<boolean> {
    return this.http
      .post<ApiResponse<User>>(
        `${environment.API_URL}/auth/login`,
        {
          identifier,
          password,
        },
        { withCredentials: true }
      )
      .pipe(
        map((response) => {
          if (response.statusCode === 200 || response.statusCode === 201) {
            localStorage.setItem('user', JSON.stringify(response.data!));
            
            return true;
          }

          return false;
        }),
        catchError(() => of(false))
      );
  }

  register(user: User): Observable<boolean> {
    return this.http
      .post<ApiResponse<User>>(`${environment.API_URL}/auth/register`, user, {
        withCredentials: true,
      })
      .pipe(
        map((response) => {
          if (response.statusCode === 200 || response.statusCode === 201) {
            this.user.set(response.data!);
            return true;
          }

          return false;
        }),
        catchError(() => of(false))
      );
  }

  logOut(): Observable<boolean> {
    return this.http
      .post<ApiResponse<User>>(`${environment.API_URL}/auth/logout`, {}, {
        withCredentials: true,
      })
      .pipe(
        map(() => {
          this.user.set(null);
          return true;
        }),
        catchError(() => of(false))
      );
  }

  usernameUsed(username: string): Observable<boolean> {
    return this.http.get<ApiResponse>(`${environment.API_URL}/user/${username}`).pipe(
      map((response) => {
        if (response.statusCode === 200 || response.statusCode === 201) {
          return true;
        }
        return false;
      }),
      catchError(() => of(false))
    );
  }
}

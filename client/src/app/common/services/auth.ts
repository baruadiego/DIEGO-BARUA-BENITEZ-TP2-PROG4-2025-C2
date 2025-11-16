import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of, map, Subscription, timer } from 'rxjs';
import { environment } from '@env/environment';
import { ApiResponse } from '../types/apiResponse';
import { User } from '../types/user';
import { NewUser } from '../types/newUser';
import Swal from 'sweetalert2';
import { ToastifyService } from './toastify';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  http = inject(HttpClient);
  toast = inject(ToastifyService);
  private refreshSubscription!: Subscription;
  REFRESH_TIMER = 60000 * 10; // 10 minutos

  throwRefreshTimer() {
    this.refreshSubscription?.unsubscribe();
    this.refreshSubscription = timer(this.REFRESH_TIMER).subscribe(() => {
      Swal.fire({
        title: 'Su sesión caduca en 5 minutos ¿Desea extenderla?',
        showDenyButton: true,
        confirmButtonText: 'Extender',
        denyButtonText: `No extender`,
        customClass: {
          popup: 'swal-popup',
          title: 'swal-title',
          confirmButton: 'swal-confirm',
          denyButton: 'swal-deny',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          this.refreshToken().subscribe((res) => {
            if (res) {
              this.throwRefreshTimer();
              this.toast.showToast('Sesión extendida con exito', 3000, 'success');
            }
          });
        }
      });
    });
  }

  isAuthenticated(): Observable<boolean> {
    return this.http
      .post<ApiResponse<User>>(`${environment.API_URL}/auth`, {}, { withCredentials: true })
      .pipe(
        map((res) => res.statusCode === 200),
        catchError(() => of(false))
      );
  }

  refreshToken(): Observable<boolean> {
    return this.http
      .post<ApiResponse<any>>(`${environment.API_URL}/auth/refresh`, {}, { withCredentials: true })
      .pipe(
        map((res) => res.statusCode === 200 || res.statusCode === 201),
        catchError(() => of(false))
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
            this.throwRefreshTimer();
            return true;
          }

          return false;
        }),
        catchError((error) => {
          const status = error.status;

          if (status === 403) {
            this.toast.showToast('Su cuenta ha sido deshabilitada', 3000, 'error');
          } else if (status === 401) {
            this.toast.showToast('Credenciales incorrectas', 3000, 'error');
          } else {
            this.toast.showToast('Error al iniciar sesión', 3000, 'error');
          }

          return of(false);
        })
      );
  }

  register(newUser: NewUser): Observable<boolean> {
    return this.http
      .post<ApiResponse<User>>(`${environment.API_URL}/auth/register`, newUser, {
        withCredentials: true,
      })
      .pipe(
        map((response) => {
          if (response.statusCode === 200 || response.statusCode === 201) {
            return true;
          }

          return false;
        }),
        catchError(() => of(false))
      );
  }

  logOut(): Observable<boolean> {
    return this.http
      .post<ApiResponse<User>>(
        `${environment.API_URL}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      )
      .pipe(
        map(() => {
          localStorage.removeItem('user');
          this.refreshSubscription.unsubscribe();
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

  ngOnDestroy() {
    this.refreshSubscription?.unsubscribe();
  }
}

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

  getUsers() {
    return this.http
      .get<ApiResponse<User[]>>(`${environment.API_URL}/user`, { withCredentials: true })
      .pipe(
        map((res) => {
          return res.statusCode === 200 || res.statusCode === 201 ? res.data! : null;
        }),
        catchError(() => of(null))
      );
  }

  getUserData(id: string) {
    return this.http
      .get<ApiResponse<User>>(`${environment.API_URL}/user/${id}`, { withCredentials: true })
      .pipe(
        map((res) => {
          return res.statusCode === 200 || res.statusCode === 201 ? res.data! : null;
        }),
        catchError(() => of(null))
      );
  }

  getUserPosts(page: number = 1, limit: number = 10) {
    return this.http
      .get<ApiResponse>(`${environment.API_URL}/user/posts?page=${page}&limit=${limit}`, { withCredentials: true })
      .pipe(
        map((res) => {
          if(res.statusCode === 200 || res.statusCode === 201){
            return {
              posts: res.data,
              page: res.page,
              totalPages: res.totalPages
            }
          }
          return  null
        }),
        catchError(() => of(null))
      );
  }

  getActivity(id: string) {
    return this.http
      .get<ApiResponse>(`${environment.API_URL}/user/${id}/activity`, { withCredentials: true })
      .pipe(
        map((res) => {
          if(res.statusCode === 200 || res.statusCode === 201){
            return res.data
          }
          return  null
        }),
        catchError(() => of(null))
      )
  }

  enable(id: string) {
    return this.http
      .post<ApiResponse>(`${environment.API_URL}/user/${id}/enable`,{}, { withCredentials: true })
      .pipe(
        map((res) => res.statusCode === 200 || res.statusCode === 201),
        catchError(() => of(false))
      );
  }

  disable(id: string) {
    return this.http
      .delete<ApiResponse>(`${environment.API_URL}/user/${id}`, { withCredentials: true })
      .pipe(
        map((res) => res.statusCode === 200 || res.statusCode === 201),
        catchError(() => of(false))
      );
  }

  changeRole(id: string, role: 'admin' | 'user') {
    return this.http
      .patch<ApiResponse>(`${environment.API_URL}/user/${id}/change-role`,{role}, { withCredentials: true })
      .pipe(
        map((res) => res.statusCode === 200 || res.statusCode === 201),
        catchError(() => of(false))
      );
  }
}

import { inject, Injectable } from '@angular/core';
import { Post } from '../types/post';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { catchError, map, Observable, of } from 'rxjs';
import { ApiResponse } from '../types/apiResponse';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  http = inject(HttpClient)
  createPost(newPost: Post) {
    return this.http.post<ApiResponse>(`${environment.API_URL}/post`, newPost, {withCredentials: true})
    .pipe(
      map((res) => res.statusCode === 200 || res.statusCode === 201),
      catchError(() => of(false))
    );
  }

  getAllPosts(page: number = 1, limit: number = 10, orderBy: 'likesCount' | 'createdAt' = 'createdAt'): Observable<Post[]> {
    return this.http.get<ApiResponse<Post[]>>(`${environment.API_URL}/post?orderBy=${orderBy}&page=${page}&limit=${limit}`, {withCredentials: true})
    .pipe(
      map((res) => {
        return res.statusCode === 200 || res.statusCode === 201? res.data! : [];
      }),
      catchError(() => of([]))
    );
  }
}

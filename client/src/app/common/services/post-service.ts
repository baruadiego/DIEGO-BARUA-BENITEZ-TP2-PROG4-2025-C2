import { inject, Injectable } from '@angular/core';
import { Post } from '../types/post';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { catchError, map, Observable, of } from 'rxjs';
import { ApiResponse } from '../types/apiResponse';
import { NewPost } from '../types/newPost';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  http = inject(HttpClient);
  createPost(newPost: NewPost) {
    return this.http
      .post<ApiResponse>(`${environment.API_URL}/post`, newPost, { withCredentials: true })
      .pipe(
        map((res) => res.statusCode === 200 || res.statusCode === 201),
        catchError(() => of(false))
      );
  }

  getAllPosts(
    page: number = 1,
    limit: number = 10,
    sortBy: 'likesCount' | 'createdAt' = 'createdAt'
  ): Observable<Post[]> {
    return this.http
      .get<ApiResponse<Post[]>>(
        `${environment.API_URL}/post?sortBy=${sortBy}&page=${page}&limit=${limit}`,
        { withCredentials: true }
      )
      .pipe(
        map((res) => {
          return res.statusCode === 200 || res.statusCode === 201 ? res.data! : [];
        }),
        catchError(() => of([]))
      );
  }

  likePost(postId: string) {
    return this.http
      .put<ApiResponse>(`${environment.API_URL}/post/${postId}/like`, {}, { withCredentials: true })
      .pipe(
        map((res) => res.statusCode === 200 || res.statusCode === 201),
        catchError(() => of(false))
      );
  }

  unlikePost(postId: string) {
    return this.http
      .put<ApiResponse>(
        `${environment.API_URL}/post/${postId}/unlike`,
        {},
        { withCredentials: true }
      )
      .pipe(
        map((res) => res.statusCode === 200 || res.statusCode === 201),
        catchError(() => of(false))
      );
  }

  deletePost(postId: string) {
    return this.http
      .delete<ApiResponse>(`${environment.API_URL}/post/${postId}`, { withCredentials: true })
      .pipe(
        map((res) => res.statusCode === 200 || res.statusCode === 201),
        catchError(() => of(false))
      );
  }
}

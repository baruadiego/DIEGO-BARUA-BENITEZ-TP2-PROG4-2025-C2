import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse } from '../types/apiResponse';
import { catchError, map, Observable, of } from 'rxjs';
import { NewComment } from '../types/new-comment';
import { Comment } from '../types/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  http = inject(HttpClient)

  getComments(postId: string, page: number = 1, limit: number = 10) {
    return this.http
      .get<ApiResponse>(`${environment.API_URL}/comment?postId=${postId}&page=${page}&limit=${limit}`, { withCredentials: true })
      .pipe(
        map((res) => {
          if(res.statusCode === 200 || res.statusCode === 201){
            return {
              comments: res.data,
              page: res.page,
              totalPages: res.totalPages
            }
          }
          return  null
        }),
        catchError(() => of(null))
      );
  }

  createComment(newComment: NewComment) {
    return this.http
      .post<ApiResponse>(`${environment.API_URL}/comment`,  newComment, { withCredentials: true })
      .pipe(
        map((res) => res.statusCode === 200 || res.statusCode === 201),
        catchError(() => of(false))
      );
  }

  deleteComment(commentId: string) {
    return this.http
      .delete<ApiResponse>(`${environment.API_URL}/comment/${commentId}`, { withCredentials: true })
      .pipe(
        map((res) => res.statusCode === 200 || res.statusCode === 201),
        catchError(() => of(false))
      );
  }

  updateComment(commentId: string, content: string) {
    return this.http
      .patch<ApiResponse>(`${environment.API_URL}/comment/${commentId}`, { content }, { withCredentials: true })
      .pipe(
        map((res) => res.statusCode === 200 || res.statusCode === 201),
        catchError(() => of(false))
      );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ApiClientService {
  private API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // GET all posts
  getPosts(page: number = 1, limit: number = 10): Observable<any> {
    return this.http
      .get(`${this.API_URL}posts?_page=${page}&_limit=${limit}`)
      .pipe(retry(3), catchError(this.handleError));
  }

  // GET single post by ID
  getPost(id: number): Observable<any> {
    return this.http
      .get(`${this.API_URL}posts/${id}`)
      .pipe(retry(3), catchError(this.handleError));
  }

  // POST new post
  createPost(post: any): Observable<any> {
    return this.http
      .post(`${this.API_URL}posts`, post)
      .pipe(catchError(this.handleError));
  }

  // PUT update a post
  updatePost(id: number, post: any): Observable<any> {
    return this.http
      .put(`${this.API_URL}posts/${id}`, post)
      .pipe(catchError(this.handleError));
  }

  // DELETE a post
  deletePost(id: number): Observable<any> {
    return this.http
      .delete(`${this.API_URL}posts/${id}`)
      .pipe(catchError(this.handleError));
  }

  getPostComments(postId: number): Observable<any> {
    return this.http
      .get(`${this.API_URL}posts/${postId}/comments`)
      .pipe(retry(3), catchError(this.handleError));
  }

  // Error handler
  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error('Something went wrong!'));
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, of, retry, tap, throwError } from 'rxjs';
import { ErrorHandlingService } from './error-handler.service';
import { CachingService } from './caching.service';
import { environment } from '../../environments/environment.development';


@Injectable({
  providedIn: 'root',
})
export class ApiClientService {
  private baseUrl = environment.apiUrl;
  private cacheKey = 'posts';

  constructor(
    private http: HttpClient,
    private cachingService: CachingService,
    private errorHandlingService: ErrorHandlingService
  ) {}

  // Get posts from cache or API
  getPosts(page: number, limit: number): Observable<any[]> {
    const cachedData = this.cachingService.getCache(this.cacheKey);
    // if (cachedData) {
    //   const startIndex = (page - 1) * limit;
    //   const paginatedData = cachedData.slice(startIndex, startIndex + limit);
    //   return of(paginatedData);
    // }
    return this.getRequest<any[]>(`posts?_page=${page}&_limit=${limit}`).pipe(
      tap((data) => this.cachingService.setCache(this.cacheKey, data)),
      this.errorHandlingService.handleRequest<any[]>()
    );
  }

  // Create a new post and add it to Local Storage or cache
  createPost(post: any): Observable<any> {
    const cachedData = this.cachingService.getCache(this.cacheKey) || [];
    post.id = cachedData.length ? cachedData[cachedData.length - 1].id + 1 : 1;
    cachedData.push(post);
    this.cachingService.setCache(this.cacheKey, cachedData); // Update the cache
    return of(post); // Returning Observable with newly created post
  }

  // Get a post by its ID
  getPostById(id: number): Observable<any> {
    const cachedData = this.cachingService.getCache(this.cacheKey);
    if (cachedData) {
      const post = cachedData.find((item: any) => item.id === id);
      if (post) {
        return of(post);
      }
    }
    return this.getRequest<any>(`posts/${id}`).pipe(
      this.errorHandlingService.handleRequest<any>()
    );
  }

  // Update a post and update the cache
  updatePostById(id: number, updatedPost: any): Observable<any> {
    return this.putRequest<any>(`posts/${id}`, updatedPost).pipe(
      tap(() => {
        const cachedData = this.cachingService.getCache(this.cacheKey);
        if (cachedData) {
          const index = cachedData.findIndex((post: any) => post.id === id);
          if (index !== -1) {
            cachedData[index] = updatedPost;
            this.cachingService.setCache(this.cacheKey, cachedData);
          }
        }
      }),
      this.errorHandlingService.handleRequest<any>()
    );
  }

  // Delete a post and remove it from cache
  deletePostById(id: number): Observable<any> {
    return this.deleteRequest<any>(`posts/${id}`).pipe(
      tap(() => {
        const cachedData = this.cachingService.getCache(this.cacheKey);
        if (cachedData) {
          const updatedCache = cachedData.filter((post: any) => post.id !== id);
          this.cachingService.setCache(this.cacheKey, updatedCache);
        }
      }),
      this.errorHandlingService.handleRequest<any>()
    );
  }

  // Fetch comments for a specific post
  getPostComments(postId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}posts/${postId}/comments`).pipe(
      retry(3), // Retry the request up to 3 times if it fails
      catchError(this.handleError) // Handle errors
    );
  }

  // Helper function for GET requests
  private getRequest<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`);
  }

  // Helper function for PUT requests
  private putRequest<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, body);
  }

  // Helper function for DELETE requests
  private deleteRequest<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`);
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error('Something went wrong!'));
  }
}


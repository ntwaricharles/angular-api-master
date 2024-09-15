import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlingService {
  // Handle HTTP errors
  handleRequest<T>(): (source: Observable<T>) => Observable<T> {
    return (source: Observable<T>) =>
      source.pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'An unknown error occurred!';
          if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = `Error: ${error.error.message}`;
          } else {
            // Server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
          }
          return throwError(() => new Error(errorMessage));
        })
      );
  }
}

import { TestBed } from '@angular/core/testing';
import { ErrorHandlingService } from './error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';

describe('ErrorHandlingService', () => {
  let service: ErrorHandlingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorHandlingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle client-side errors', (done) => {
    const clientError = new ErrorEvent('Client Error', {
      message: 'Client error message',
    });
    const clientErrorResponse = new HttpErrorResponse({
      error: clientError,
      status: 0,
      statusText: 'Client Error',
      url: '',
    });

    const observable$ = throwError(() => clientErrorResponse);
    observable$.pipe(service.handleRequest()).subscribe({
      error: (err) => {
        expect(err.message).toBe('Error: Client error message');
        done();
      },
    });
  });

  it('should handle server-side errors', (done) => {
    const serverErrorResponse = new HttpErrorResponse({
      error: 'Server error',
      status: 500,
      statusText: 'Server Error',
      url: '',
    });

    const observable$ = throwError(() => serverErrorResponse);
    observable$.pipe(service.handleRequest()).subscribe({
      error: (err) => {
        expect(err.message).toBe('Error Code: 500\nMessage: Server error');
        done();
      },
    });
  });

  it('should return an observable with a transformed error message', (done) => {
    const errorResponse = new HttpErrorResponse({
      error: 'Not Found',
      status: 404,
      statusText: 'Not Found',
      url: '',
    });

    const observable$ = throwError(() => errorResponse);
    observable$.pipe(service.handleRequest()).subscribe({
      error: (err) => {
        expect(err.message).toBe('Error Code: 404\nMessage: Not Found');
        done();
      },
    });
  });
});

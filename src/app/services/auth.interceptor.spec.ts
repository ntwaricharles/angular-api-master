import { AuthInterceptor } from './auth.interceptor';
import { HttpHandler, HttpRequest } from '@angular/common/http';
import { of } from 'rxjs';

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;

  beforeEach(() => {
    interceptor = new AuthInterceptor();
  });

  it('should add an Authorization header', () => {
    const mockRequest = new HttpRequest('GET', '/test-url');
    const mockHandler = {
      handle: jest.fn().mockReturnValue(of(null)),
    };

    interceptor.intercept(mockRequest, mockHandler as any).subscribe();

    const expectedHeader = 'Bearer mock-token-12345';
    const modifiedRequest = mockHandler.handle.mock.calls[0][0]; // Extract the request passed to next.handle

    expect(modifiedRequest.headers.get('Authorization')).toBe(expectedHeader);
    expect(mockHandler.handle).toHaveBeenCalledWith(modifiedRequest);
  });

  it('should call next.handle with the modified request', () => {
    const mockRequest = new HttpRequest('GET', '/test-url');
    const mockHandler = {
      handle: jest.fn().mockReturnValue(of(null)),
    };

    interceptor.intercept(mockRequest, mockHandler as any).subscribe();

    // Ensure that next.handle was called with a request object
    expect(mockHandler.handle).toHaveBeenCalledWith(expect.any(HttpRequest));
  });
});

import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ApiClientService } from './api-client.service';
import { environment } from '../../environments/environment.development';

describe('ApiClientService', () => {
  let service: ApiClientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiClientService],
    });

    service = TestBed.inject(ApiClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPosts', () => {
    it('should return an Observable<any>', () => {
      const mockPosts = [{ id: 1, title: 'Test Post' }];

      service.getPosts(1, 10).subscribe((posts) => {
        expect(posts).toEqual(mockPosts);
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}posts?_page=1&_limit=10`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPosts);
    });

    it('should handle errors', () => {
      service.getPosts(1, 10).subscribe(
        () => fail('Expected error'),
        (error) => expect(error.message).toContain('Something went wrong!')
      );

      const req = httpMock.expectOne(
        `${environment.apiUrl}posts?_page=1&_limit=10`
      );
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getPost', () => {
    it('should return an Observable<any>', () => {
      const mockPost = { id: 1, title: 'Test Post' };

      service.getPost(1).subscribe((post) => {
        expect(post).toEqual(mockPost);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}posts/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPost);
    });

    it('should handle errors', () => {
      service.getPost(1).subscribe(
        () => fail('Expected error'),
        (error) => expect(error.message).toContain('Something went wrong!')
      );

      const req = httpMock.expectOne(`${environment.apiUrl}posts/1`);
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    });
  });

});

import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { ApiClientService } from './api-client.service';
import { CachingService } from './caching.service';
import { ErrorHandlingService } from './error-handler.service';

describe('ApiClientService', () => {
  let service: ApiClientService;
  let http: HttpClient;
  let cachingService: CachingService;
  let errorHandlingService: ErrorHandlingService;

  beforeEach(() => {
    const httpClientStub = {
      get: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    };
    const cachingServiceStub = { getCache: jest.fn(), setCache: jest.fn() };
    const errorHandlingServiceStub = { handleRequest: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        ApiClientService,
        { provide: HttpClient, useValue: httpClientStub },
        { provide: CachingService, useValue: cachingServiceStub },
        { provide: ErrorHandlingService, useValue: errorHandlingServiceStub },
      ],
    });

    service = TestBed.inject(ApiClientService);
    http = TestBed.inject(HttpClient);
    cachingService = TestBed.inject(CachingService);
    errorHandlingService = TestBed.inject(ErrorHandlingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPosts', () => {
    it('should return cached posts if available', () => {
      const cachedPosts = [{ id: 1, title: 'Cached Post' }];
      const page = 1;
      const limit = 10;

      (cachingService.getCache as jest.Mock).mockReturnValue(cachedPosts);

      service.getPosts(page, limit).subscribe((posts) => {
        expect(posts).toEqual(cachedPosts);
      });
    });

    it('should fetch posts from API and cache them if not cached', () => {
      const apiPosts = [{ id: 1, title: 'API Post' }];
      const page = 1;
      const limit = 10;

      (cachingService.getCache as jest.Mock).mockReturnValue(null);
      (http.get as jest.Mock).mockReturnValue(of(apiPosts));
      (errorHandlingService.handleRequest as jest.Mock).mockImplementation(
        (source) => source
      );

      service.getPosts(page, limit).subscribe((posts) => {
        expect(posts).toEqual(apiPosts);
        expect(cachingService.setCache).toHaveBeenCalledWith('posts', apiPosts);
      });
    });
  });

  describe('createPost', () => {
    it('should create a new post and update the cache', () => {
      const newPost = { title: 'New Post' };
      const cachedPosts = [{ id: 1, title: 'Cached Post' }];

      (cachingService.getCache as jest.Mock).mockReturnValue(cachedPosts);

      service.createPost(newPost).subscribe((post) => {
        expect(post).toEqual({ id: 2, title: 'New Post' });
        expect(cachingService.setCache).toHaveBeenCalledWith('posts', [
          ...cachedPosts,
          { id: 2, title: 'New Post' },
        ]);
      });
    });
  });

  describe('getPostById', () => {
    it('should return post from cache if available', () => {
      const post = { id: 1, title: 'Cached Post' };
      (cachingService.getCache as jest.Mock).mockReturnValue([post]);

      service.getPostById(1).subscribe((result) => {
        expect(result).toEqual(post);
      });
    });

    it('should fetch post from API if not in cache', () => {
      const apiPost = { id: 1, title: 'API Post' };

      (cachingService.getCache as jest.Mock).mockReturnValue(null);
      (http.get as jest.Mock).mockReturnValue(of(apiPost));
      (errorHandlingService.handleRequest as jest.Mock).mockImplementation(
        (source) => source
      );

      service.getPostById(1).subscribe((result) => {
        expect(result).toEqual(apiPost);
      });
    });
  });

  describe('updatePostById', () => {
    it('should update a post and cache the updated data', () => {
      const updatedPost = { id: 1, title: 'Updated Post' };
      const cachedPosts = [{ id: 1, title: 'Old Post' }];

      (cachingService.getCache as jest.Mock).mockReturnValue(cachedPosts);
      (http.put as jest.Mock).mockReturnValue(of(updatedPost));
      (errorHandlingService.handleRequest as jest.Mock).mockImplementation(
        (source) => source
      );

      service.updatePostById(1, updatedPost).subscribe(() => {
        expect(cachingService.setCache).toHaveBeenCalledWith('posts', [
          updatedPost,
        ]);
      });
    });
  });

  describe('deletePostById', () => {
    it('should delete a post and update the cache', () => {
      const postId = 1;
      const cachedPosts = [
        { id: 1, title: 'Post to be deleted' },
        { id: 2, title: 'Another Post' },
      ];

      (cachingService.getCache as jest.Mock).mockReturnValue(cachedPosts);
      (http.delete as jest.Mock).mockReturnValue(of(null));
      (errorHandlingService.handleRequest as jest.Mock).mockImplementation(
        (source) => source
      );

      service.deletePostById(postId).subscribe(() => {
        expect(cachingService.setCache).toHaveBeenCalledWith('posts', [
          { id: 2, title: 'Another Post' },
        ]);
      });
    });
  });

  describe('getPostComments', () => {
    it('should fetch comments from API and retry on failure', () => {
      const postId = 1;
      const comments = [{ id: 1, comment: 'Nice Post!' }];

      (http.get as jest.Mock).mockReturnValue(of(comments));

      service.getPostComments(postId).subscribe((commentsResult) => {
        expect(commentsResult).toEqual(comments);
      });
    });

    it('should handle errors and retry up to 3 times', () => {
      const postId = 1;

      (http.get as jest.Mock).mockReturnValue(
        throwError(() => new Error('Failed'))
      );
      jest
        .spyOn(service, 'getPostComments')
        .mockImplementation(() => service.getPostComments(postId));

      service.getPostComments(postId).subscribe({
        error: (error) => {
          expect(error.message).toBe('Failed');
        },
      });
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostDetailComponent } from './post-detail.component';
import { ApiClientService } from '../../services/api-client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('PostDetailComponent', () => {
  let component: PostDetailComponent;
  let fixture: ComponentFixture<PostDetailComponent>;
  let apiClientServiceMock: any;
  let activatedRouteMock: any;
  let routerMock: any;

  beforeEach(async () => {
    apiClientServiceMock = {
      getPostById: jest.fn(),
      getPostComments: jest.fn(),
    };

    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue('1'), // Assuming postId is 1
        },
      },
    };

    routerMock = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [PostDetailComponent],
      providers: [
        { provide: ApiClientService, useValue: apiClientServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getPostById and getPostComments with postId', () => {
      const mockPost = { title: 'Post Title', body: 'Post Body' };
      const mockComments = [
        { id: 1, body: 'Comment 1' },
        { id: 2, body: 'Comment 2' },
      ];

      apiClientServiceMock.getPostById.mockReturnValue(of(mockPost));
      apiClientServiceMock.getPostComments.mockReturnValue(of(mockComments));

      component.ngOnInit();

      const postId = +activatedRouteMock.snapshot.paramMap.get('id');

      expect(apiClientServiceMock.getPostById).toHaveBeenCalledWith(postId);
      expect(apiClientServiceMock.getPostComments).toHaveBeenCalledWith(postId);
      expect(component.post).toEqual(mockPost);
      expect(component.comments).toEqual(mockComments);
    });

    it('should handle error during post fetching', () => {
      apiClientServiceMock.getPostById.mockReturnValue(
        throwError(() => new Error('Failed to fetch post'))
      );

      component.ngOnInit();

      expect(apiClientServiceMock.getPostById).toHaveBeenCalled();
      expect(component.post).toBeUndefined();
    });

    it('should handle error during comments fetching', () => {
      const mockPost = { title: 'Post Title', body: 'Post Body' };
      apiClientServiceMock.getPostById.mockReturnValue(of(mockPost));
      apiClientServiceMock.getPostComments.mockReturnValue(
        throwError(() => new Error('Failed to fetch comments'))
      );

      component.ngOnInit();

      expect(apiClientServiceMock.getPostComments).toHaveBeenCalled();
      expect(component.comments).toEqual([]);
    });
  });
});

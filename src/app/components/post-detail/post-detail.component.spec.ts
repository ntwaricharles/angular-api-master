import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { PostDetailComponent } from './post-detail.component';
import { ApiClientService } from '../../services/api-client.service';

// Create a mock for ApiClientService
class ApiClientServiceMock {
  getPost = jest.fn();
  getPostComments = jest.fn();
}

describe('PostDetailComponent', () => {
  let component: PostDetailComponent;
  let fixture: ComponentFixture<PostDetailComponent>;
  let apiClientService: ApiClientServiceMock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: jest.fn().mockReturnValue('1'), // Mocking postId as '1'
              },
            },
          },
        },
        {
          provide: ApiClientService,
          useClass: ApiClientServiceMock,
        },
        { provide: Router, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostDetailComponent);
    component = fixture.componentInstance;
    apiClientService = TestBed.inject(
      ApiClientService
    ) as unknown as ApiClientServiceMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load post and comments based on the route id', () => {
      const mockPost = { id: 1, title: 'Test Post' };
      const mockComments = [{ id: 1, text: 'Test Comment' }];
      jest.spyOn(apiClientService, 'getPost').mockReturnValue(of(mockPost));
      jest
        .spyOn(apiClientService, 'getPostComments')
        .mockReturnValue(of(mockComments));

      component.ngOnInit();

      expect(apiClientService.getPost).toHaveBeenCalledWith(1);
      expect(apiClientService.getPostComments).toHaveBeenCalledWith(1);
      fixture.whenStable().then(() => {
        expect(component.post).toEqual(mockPost);
        expect(component.comments).toEqual(mockComments);
      });
    });

    it('should handle errors from ApiClientService', () => {
      jest
        .spyOn(apiClientService, 'getPost')
        .mockReturnValue(throwError(() => new Error('Error fetching post')));
      jest
        .spyOn(apiClientService, 'getPostComments')
        .mockReturnValue(
          throwError(() => new Error('Error fetching comments'))
        );

      component.ngOnInit();

      expect(apiClientService.getPost).toHaveBeenCalledWith(1);
      expect(apiClientService.getPostComments).toHaveBeenCalledWith(1);
      // Add your error handling expectations here if any
    });
  });
});

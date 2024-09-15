import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { EditPostComponent } from './edit-post.component';
import { ApiClientService } from '../../services/api-client.service';

// Create a mock for ApiClientService
class ApiClientServiceMock {
  getPost = jest.fn();
  updatePost = jest.fn();
}

describe('EditPostComponent', () => {
  let component: EditPostComponent;
  let fixture: ComponentFixture<EditPostComponent>;
  let apiClientService: ApiClientServiceMock;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditPostComponent],
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
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditPostComponent);
    component = fixture.componentInstance;
    apiClientService = TestBed.inject(
      ApiClientService
    ) as unknown as ApiClientServiceMock;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should fetch post data based on the route id', () => {
      const mockPost = { id: 1, title: 'Test Post', body: 'Test Body' };
      jest.spyOn(apiClientService, 'getPost').mockReturnValue(of(mockPost));

      component.ngOnInit();

      expect(apiClientService.getPost).toHaveBeenCalledWith(1);
      fixture.whenStable().then(() => {
        expect(component.post).toEqual(mockPost);
      });
    });

    it('should handle errors from ApiClientService when fetching post data', () => {
      jest
        .spyOn(apiClientService, 'getPost')
        .mockReturnValue(throwError(() => new Error('Error fetching post')));

      component.ngOnInit();

      expect(apiClientService.getPost).toHaveBeenCalledWith(1);
      // Add your error handling expectations here if any
    });
  });

  describe('onSubmit', () => {
    it('should update post and navigate to /posts on successful update', () => {
      const mockPost = { title: 'Updated Title', body: 'Updated Body' };
      jest.spyOn(apiClientService, 'updatePost').mockReturnValue(of(null));
      jest.spyOn(router, 'navigate');

      component.post = mockPost;
      component.onSubmit();

      expect(apiClientService.updatePost).toHaveBeenCalledWith(1, mockPost);
      expect(router.navigate).toHaveBeenCalledWith(['/posts']);
    });

    it('should handle errors from ApiClientService when updating post', () => {
      jest
        .spyOn(apiClientService, 'updatePost')
        .mockReturnValue(throwError(() => new Error('Error updating post')));
      jest.spyOn(router, 'navigate');

      component.onSubmit();

      expect(apiClientService.updatePost).toHaveBeenCalledWith(
        1,
        component.post
      );
      expect(router.navigate).not.toHaveBeenCalled();
      // Add your error handling expectations here if any
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CreatePostComponent } from './create-post.component';
import { ApiClientService } from '../../services/api-client.service';

describe('CreatePostComponent', () => {
  let component: CreatePostComponent;
  let fixture: ComponentFixture<CreatePostComponent>;
  let apiClientService: ApiClientService;
  const createPostMock = jest.fn();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreatePostComponent],
      providers: [
        {
          provide: ApiClientService,
          useValue: { createPost: createPostMock },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePostComponent);
    component = fixture.componentInstance;
    apiClientService = TestBed.inject(ApiClientService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubmit', () => {
    it('should call createPost and show an alert on success', () => {
      // Arrange
      const post = { title: 'Test Title', body: 'Test Body' };
      component.post = post;
      createPostMock.mockReturnValue(of({})); // Mock the API response

      // Spy on the alert function
      jest.spyOn(window, 'alert').mockImplementation(() => {});

      // Act
      component.onSubmit();

      // Assert
      expect(createPostMock).toHaveBeenCalledWith(post);
      expect(createPostMock).toHaveBeenCalledTimes(1);
      expect(window.alert).toHaveBeenCalledWith('Post created successfully!');
    });
  });
});

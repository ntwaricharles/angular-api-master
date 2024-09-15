import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreatePostComponent } from './create-post.component';
import { ApiClientService } from '../../services/api-client.service';
import { of } from 'rxjs';

describe('CreatePostComponent', () => {
  let component: CreatePostComponent;
  let fixture: ComponentFixture<CreatePostComponent>;
  let apiClientService: ApiClientService;

  beforeEach(async () => {
    // Mock the ApiClientService
    const apiClientServiceMock = {
      createPost: jest.fn().mockReturnValue(of({})), // Mocked return observable
    };

    await TestBed.configureTestingModule({
      declarations: [CreatePostComponent],
      providers: [
        { provide: ApiClientService, useValue: apiClientServiceMock },
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

  it('should call createPost method when onSubmit is triggered', () => {
    // Arrange
    const post = { title: 'Test Title', body: 'Test Body' };
    component.post = post;

    // Spy on the apiClient.createPost method
    const createPostSpy = jest.spyOn(apiClientService, 'createPost');

    // Spy on the window alert method
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    // Act
    component.onSubmit();

    // Assert
    expect(createPostSpy).toHaveBeenCalledWith(post);
    expect(window.alert).toHaveBeenCalledWith('Post created successfully!');
  });
});

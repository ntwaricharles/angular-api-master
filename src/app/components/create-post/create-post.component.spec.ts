import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreatePostComponent } from './create-post.component';
import { ApiClientService } from '../../services/api-client.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('CreatePostComponent', () => {
  let component: CreatePostComponent;
  let fixture: ComponentFixture<CreatePostComponent>;
  let apiClientServiceMock: any;

  beforeEach(async () => {
    apiClientServiceMock = {
      createPost: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [CreatePostComponent],
      imports: [FormsModule], // To bind the form controls properly
      providers: [
        { provide: ApiClientService, useValue: apiClientServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('isFormValid', () => {
    it('should return true when form fields are filled', () => {
      component.post = { title: 'Test Title', body: 'Test Body' };
      expect(component.isFormValid()).toBe(true);
    });

    it('should return false when title or body is empty', () => {
      component.post = { title: '', body: 'Test Body' };
      expect(component.isFormValid()).toBe(false);

      component.post = { title: 'Test Title', body: '' };
      expect(component.isFormValid()).toBe(false);
    });
  });

  describe('onSubmit', () => {
    it('should set validation error if form is invalid', () => {
      component.post = { title: '', body: '' };
      component.onSubmit();
      expect(component.validationError).toBe('All fields are required!');
    });

    it('should call createPost when form is valid', () => {
      component.post = { title: 'Test Title', body: 'Test Body' };
      apiClientServiceMock.createPost.mockReturnValue(of({}));
      component.onSubmit();

      expect(apiClientServiceMock.createPost).toHaveBeenCalledWith(
        component.post
      );
      expect(component.loading).toBe(true);
    });

    it('should handle successful post creation', (done) => {
      component.post = { title: 'Test Title', body: 'Test Body' };
      apiClientServiceMock.createPost.mockReturnValue(of({}));

      component.onSubmit();

      setTimeout(() => {
        expect(component.successMessage).toBe('Post created successfully!');
        expect(component.errorMessage).toBe('');
        expect(component.loading).toBe(false);
        expect(component.post.title).toBe('');
        expect(component.post.body).toBe('');
        done();
      }, 1000); // Wait for the timeout in the component
    });

    it('should handle post creation failure', (done) => {
      component.post = { title: 'Test Title', body: 'Test Body' };
      apiClientServiceMock.createPost.mockReturnValue(
        throwError(() => new Error('error'))
      );

      component.onSubmit();

      setTimeout(() => {
        expect(component.successMessage).toBe('');
        expect(component.errorMessage).toBe(
          'Failed to create post. Please try again.'
        );
        expect(component.loading).toBe(false);
        done();
      }, 1000); // Wait for the timeout in the component
    });
  });

  describe('resetForm', () => {
    it('should reset form fields', () => {
      component.post = { title: 'Some Title', body: 'Some Body' };
      component.resetForm();
      expect(component.post).toEqual({ title: '', body: '' });
    });
  });
});

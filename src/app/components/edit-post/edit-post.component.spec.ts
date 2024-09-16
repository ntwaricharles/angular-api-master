import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditPostComponent } from './edit-post.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiClientService } from '../../services/api-client.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('EditPostComponent', () => {
  let component: EditPostComponent;
  let fixture: ComponentFixture<EditPostComponent>;
  let apiClientServiceMock: any;
  let routerMock: any;
  let activatedRouteMock: any;

  beforeEach(async () => {
    apiClientServiceMock = {
      getPostById: jest.fn(),
      updatePostById: jest.fn(),
    };
    routerMock = {
      navigate: jest.fn(),
    };
    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue('1'),
        },
      },
    };

    await TestBed.configureTestingModule({
      declarations: [EditPostComponent],
      imports: [FormsModule], // To bind the form controls
      providers: [
        { provide: ApiClientService, useValue: apiClientServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getPostById and set post data on success', () => {
      const postData = { title: 'Test Title', body: 'Test Body' };
      apiClientServiceMock.getPostById.mockReturnValue(of(postData));

      component.ngOnInit();
      expect(apiClientServiceMock.getPostById).toHaveBeenCalledWith(1);
      expect(component.post).toEqual(postData);
      expect(component.errorMessage).toBe('');
    });

    it('should set errorMessage when getPostById fails', () => {
      apiClientServiceMock.getPostById.mockReturnValue(
        throwError(() => new Error('error'))
      );

      component.ngOnInit();
      expect(apiClientServiceMock.getPostById).toHaveBeenCalledWith(1);
      expect(component.errorMessage).toBe('Failed to load post data.');
    });
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

    it('should call updatePostById when form is valid', () => {
      component.post = { title: 'Test Title', body: 'Test Body' };
      apiClientServiceMock.updatePostById.mockReturnValue(of({}));

      component.onSubmit();
      expect(apiClientServiceMock.updatePostById).toHaveBeenCalledWith(
        1,
        component.post
      );
      expect(component.loading).toBe(true);
    });

    it('should handle successful post update', (done) => {
      component.post = { title: 'Test Title', body: 'Test Body' };
      apiClientServiceMock.updatePostById.mockReturnValue(of({}));

      component.onSubmit();

      setTimeout(() => {
        expect(component.successMessage).toBe('Post updated successfully!');
        expect(component.errorMessage).toBe('');
        expect(component.loading).toBe(false);
        expect(routerMock.navigate).toHaveBeenCalledWith(['/posts']);
        done();
      }, 500); // Wait for the timeout in the component
    });

    it('should handle update post failure', (done) => {
      component.post = { title: 'Test Title', body: 'Test Body' };
      apiClientServiceMock.updatePostById.mockReturnValue(
        throwError(() => new Error('error'))
      );

      component.onSubmit();

      setTimeout(() => {
        expect(component.successMessage).toBe('');
        expect(component.errorMessage).toBe(
          'Failed to update post. Please try again.'
        );
        expect(component.loading).toBe(false);
        done();
      }, 500); // Wait for the timeout in the component
    });
  });
});

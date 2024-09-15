import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { PostsListComponent } from './posts-list.component';
import { ApiClientService } from '../../services/api-client.service';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

// Create a mock for ApiClientService
class ApiClientServiceMock {
  getPosts = jest.fn();
  deletePost = jest.fn();
}

describe('PostsListComponent', () => {
  let component: PostsListComponent;
  let fixture: ComponentFixture<PostsListComponent>;
  let apiClientService: ApiClientServiceMock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostsListComponent, DeleteModalComponent],
      providers: [
        { provide: ApiClientService, useClass: ApiClientServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore unknown elements (e.g., DeleteModalComponent)
    }).compileComponents();

    fixture = TestBed.createComponent(PostsListComponent);
    component = fixture.componentInstance;
    apiClientService = TestBed.inject(
      ApiClientService
    ) as unknown as ApiClientServiceMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loadPosts', () => {
    it('should load posts and set them in the component', () => {
      const mockPosts = [{ id: 1, title: 'Test Post' }];
      apiClientService.getPosts.mockReturnValue(of(mockPosts));

      component.loadPosts();

      expect(apiClientService.getPosts).toHaveBeenCalledWith(
        component.currentPage,
        10
      );
      expect(component.posts).toEqual(mockPosts);
    });

    it('should handle error when loading posts', () => {
      apiClientService.getPosts.mockReturnValue(
        throwError(() => new Error('Error fetching posts'))
      );

      component.loadPosts();

      expect(apiClientService.getPosts).toHaveBeenCalled();
      // Add your error handling expectations here if any
    });
  });

  describe('openDeleteModal', () => {
    it('should open the delete modal and set postIdToDelete', () => {
      const mockPostId = 1;
      const deleteModal = fixture.debugElement.query(
        By.directive(DeleteModalComponent)
      ).componentInstance;

      component.openDeleteModal(mockPostId);

      expect(component.postIdToDelete).toBe(mockPostId);
      expect(deleteModal.openModal).toHaveBeenCalled();
    });
  });

  describe('cancelDelete', () => {
    it('should reset postIdToDelete and log cancellation', () => {
      component.postIdToDelete = 1;
      const consoleSpy = jest.spyOn(console, 'log');

      component.cancelDelete();

      expect(component.postIdToDelete).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('Delete action canceled');
    });
  });

  describe('deletePost', () => {
    it('should delete the post and reload posts', () => {
      const mockPostId = 1;
      const mockPosts = [{ id: 1, title: 'Test Post' }];
      apiClientService.deletePost.mockReturnValue(of(null));
      apiClientService.getPosts.mockReturnValue(of(mockPosts));

      component.postIdToDelete = mockPostId;
      component.deletePost();

      expect(apiClientService.deletePost).toHaveBeenCalledWith(mockPostId);
      expect(apiClientService.getPosts).toHaveBeenCalled();
      expect(component.posts).toEqual(mockPosts);
      expect(component.postIdToDelete).toBeNull();
    });

    it('should handle error during delete operation', () => {
      apiClientService.deletePost.mockReturnValue(
        throwError(() => new Error('Error deleting post'))
      );

      component.postIdToDelete = 1;
      component.deletePost();

      expect(apiClientService.deletePost).toHaveBeenCalled();
      // Add your error handling expectations here if any
    });
  });

  describe('onPageChange', () => {
    it('should update the currentPage and load posts', () => {
      const newPage = 2;
      const mockPosts = [{ id: 1, title: 'Test Post' }];
      apiClientService.getPosts.mockReturnValue(of(mockPosts));

      component.onPageChange(newPage);

      expect(component.currentPage).toBe(newPage);
      expect(apiClientService.getPosts).toHaveBeenCalledWith(newPage, 10);
      expect(component.posts).toEqual(mockPosts);
    });
  });
});

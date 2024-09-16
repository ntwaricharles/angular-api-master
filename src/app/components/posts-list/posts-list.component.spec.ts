import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostsListComponent } from './posts-list.component';
import { ApiClientService } from '../../services/api-client.service';
import { of, throwError } from 'rxjs';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';

describe('PostsListComponent', () => {
  let component: PostsListComponent;
  let fixture: ComponentFixture<PostsListComponent>;
  let apiClientServiceMock: any;

  beforeEach(async () => {
    apiClientServiceMock = {
      getPosts: jest.fn(),
      createPost: jest.fn(),
      deletePostById: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [PostsListComponent, DeleteModalComponent],
      providers: [
        { provide: ApiClientService, useValue: apiClientServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call loadPosts on initialization', () => {
      const loadPostsSpy = jest.spyOn(component, 'loadPosts');
      component.ngOnInit();
      expect(loadPostsSpy).toHaveBeenCalled();
    });
  });

  describe('loadPosts', () => {
    it('should fetch posts and calculate total pages', () => {
      const mockPostsPage = Array(10).fill({
        title: 'Post Title',
        body: 'Post Body',
      });
      const mockAllPosts = Array(25).fill({
        title: 'Post Title',
        body: 'Post Body',
      });

      apiClientServiceMock.getPosts
        .mockReturnValueOnce(of(mockPostsPage))
        .mockReturnValueOnce(of(mockAllPosts));

      component.loadPosts();

      expect(apiClientServiceMock.getPosts).toHaveBeenCalledWith(
        component.currentPage,
        component.postsPerPage
      );
      expect(component.posts.length).toBe(10);
      expect(component.totalPosts).toBe(25);
      expect(component.totalPages).toBe(3); // Since 25 total posts and 10 per page
    });

    it('should handle error during post fetching', () => {
      apiClientServiceMock.getPosts.mockReturnValue(
        throwError(() => new Error('Error'))
      );

      component.loadPosts();
      expect(apiClientServiceMock.getPosts).toHaveBeenCalledWith(
        component.currentPage,
        component.postsPerPage
      );
      expect(component.posts).toEqual([]); // No posts should be loaded
    });
  });

  describe('onPageChange', () => {
    it('should update currentPage and reload posts', () => {
      const loadPostsSpy = jest.spyOn(component, 'loadPosts');
      component.onPageChange(2);
      expect(component.currentPage).toBe(2);
      expect(loadPostsSpy).toHaveBeenCalled();
    });
  });

  describe('createPost', () => {
    it('should call apiClient to create a post and reload posts', () => {
      const mockPost = { title: 'New Post', body: 'New Body' };
      apiClientServiceMock.createPost.mockReturnValue(of({}));
      const loadPostsSpy = jest.spyOn(component, 'loadPosts');

      component.createPost(mockPost);
      expect(apiClientServiceMock.createPost).toHaveBeenCalledWith(mockPost);
      expect(loadPostsSpy).toHaveBeenCalled();
    });

    it('should handle error during post creation', () => {
      const mockPost = { title: 'New Post', body: 'New Body' };
      apiClientServiceMock.createPost.mockReturnValue(
        throwError(() => new Error('Error'))
      );

      component.createPost(mockPost);
      expect(apiClientServiceMock.createPost).toHaveBeenCalledWith(mockPost);
    });
  });

  describe('openDeleteModal', () => {
    it('should set postIdToDelete and open the delete modal', () => {
      component.deleteModal = { openModal: jest.fn() } as any;
      const postId = 123;

      component.openDeleteModal(postId);
      expect(component.postIdToDelete).toBe(postId);
      expect(component.deleteModal.openModal).toHaveBeenCalled();
    });
  });

  describe('cancelDelete', () => {
    it('should clear postIdToDelete', () => {
      component.postIdToDelete = 123;
      component.cancelDelete();
      expect(component.postIdToDelete).toBeNull();
    });
  });

  describe('deletePost', () => {
    it('should call apiClient to delete post and reload posts on success', () => {
      component.postIdToDelete = 123;
      apiClientServiceMock.deletePostById.mockReturnValue(of({}));
      const loadPostsSpy = jest.spyOn(component, 'loadPosts');

      component.deletePost();
      expect(apiClientServiceMock.deletePostById).toHaveBeenCalledWith(123);
      expect(component.postIdToDelete).toBeNull();
      expect(loadPostsSpy).toHaveBeenCalled();
    });

    it('should handle error during post deletion', () => {
      component.postIdToDelete = 123;
      apiClientServiceMock.deletePostById.mockReturnValue(
        throwError(() => new Error('Error'))
      );

      component.deletePost();
      expect(apiClientServiceMock.deletePostById).toHaveBeenCalledWith(123);
    });

    it('should not attempt to delete if postIdToDelete is null', () => {
      const deletePostSpy = jest.spyOn(apiClientServiceMock, 'deletePostById');
      component.postIdToDelete = null;
      component.deletePost();
      expect(deletePostSpy).not.toHaveBeenCalled();
    });
  });
});

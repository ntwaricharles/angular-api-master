import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostsListComponent } from './posts-list.component';
import { ApiClientService } from '../../services/api-client.service';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PostsListComponent', () => {
  let component: PostsListComponent;
  let fixture: ComponentFixture<PostsListComponent>;
  let apiClientService: ApiClientService;

  beforeEach(async () => {
    const apiClientServiceMock = {
      getPosts: jest.fn().mockReturnValue(of([{ id: 1, title: 'Post 1' }])),
      deletePostById: jest.fn().mockReturnValue(of({})),
    };

    await TestBed.configureTestingModule({
      declarations: [PostsListComponent, DeleteModalComponent],
      providers: [
        { provide: ApiClientService, useValue: apiClientServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore child components like DeleteModalComponent
    }).compileComponents();

    fixture = TestBed.createComponent(PostsListComponent);
    component = fixture.componentInstance;
    apiClientService = TestBed.inject(ApiClientService);
    fixture.detectChanges(); // Trigger ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadPosts on ngOnInit', () => {
    const loadPostsSpy = jest.spyOn(component, 'loadPosts');
    component.ngOnInit();
    expect(loadPostsSpy).toHaveBeenCalled();
  });

  it('should load posts from the API', () => {
    expect(apiClientService.getPosts).toHaveBeenCalledWith(1, 10);
    expect(component.posts).toEqual([{ id: 1, title: 'Post 1' }]);
  });

  it('should open delete modal and set postIdToDelete', () => {
    component.deleteModal = { openModal: jest.fn() } as any;
    const postId = 1;
    component.openDeleteModal(postId);

    expect(component.postIdToDelete).toBe(postId);
    expect(component.deleteModal.openModal).toHaveBeenCalled();
  });

  it('should cancel delete and reset postIdToDelete', () => {
    component.postIdToDelete = 1;
    component.cancelDelete();
    expect(component.postIdToDelete).toBeNull();
  });

  it('should delete post and reload posts', () => {
    const loadPostsSpy = jest.spyOn(component, 'loadPosts');
    component.postIdToDelete = 1;

    component.deletePost();

    expect(apiClientService.deletePostById).toHaveBeenCalledWith(1);
    expect(loadPostsSpy).toHaveBeenCalled();
    expect(component.postIdToDelete).toBeNull();
  });

  it('should change page and load posts', () => {
    const loadPostsSpy = jest.spyOn(component, 'loadPosts');
    const newPage = 2;

    component.onPageChange(newPage);

    expect(component.currentPage).toBe(newPage);
    expect(loadPostsSpy).toHaveBeenCalled();
  });
});

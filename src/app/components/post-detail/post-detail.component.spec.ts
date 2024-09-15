import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { PostDetailComponent } from './post-detail.component';
import { ApiClientService } from '../../services/api-client.service';

// Create mocks for the services and dependencies
class MockApiClientService {
  getPostById(id: number) {
    return of({ id, title: 'Mock Post Title' });
  }

  getPostComments(postId: number) {
    return of([{ id: 1, comment: 'Great post!' }]);
  }
}

class MockActivatedRoute {
  snapshot = {
    paramMap: {
      get: jest.fn().mockReturnValue('1'), // Mock the route parameter 'id' to return '1'
    },
  };
}

class MockRouter {
  navigate = jest.fn();
}

describe('PostDetailComponent', () => {
  let component: PostDetailComponent;
  let fixture: ComponentFixture<PostDetailComponent>;
  let apiClientService: ApiClientService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostDetailComponent],
      providers: [
        { provide: ApiClientService, useClass: MockApiClientService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostDetailComponent);
    component = fixture.componentInstance;
    apiClientService = TestBed.inject(ApiClientService);
    fixture.detectChanges(); // Trigger initial data binding
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch post details on initialization', () => {
    const postId = 1;
    const postData = { id: postId, title: 'Mock Post Title' };

    // Spy on the service method and ensure it is called
    jest.spyOn(apiClientService, 'getPostById').mockReturnValue(of(postData));

    component.ngOnInit();

    expect(apiClientService.getPostById).toHaveBeenCalledWith(postId);
    expect(component.post).toEqual(postData);
  });

  it('should fetch comments on initialization', () => {
    const commentsData = [{ id: 1, comment: 'Great post!' }];

    // Spy on the service method and ensure it is called
    jest
      .spyOn(apiClientService, 'getPostComments')
      .mockReturnValue(of(commentsData));

    component.ngOnInit();

    expect(apiClientService.getPostComments).toHaveBeenCalledWith(1);
    expect(component.comments).toEqual(commentsData);
  });
});

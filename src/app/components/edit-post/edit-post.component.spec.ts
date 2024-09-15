import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditPostComponent } from './edit-post.component';
import { ApiClientService } from '../../services/api-client.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('EditPostComponent', () => {
  let component: EditPostComponent;
  let fixture: ComponentFixture<EditPostComponent>;
  let apiClientService: ApiClientService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditPostComponent],
      imports: [
        HttpClientTestingModule, // For HttpClient testing
        RouterTestingModule, // For Router testing
      ],
      providers: [
        {
          provide: ApiClientService,
          useValue: {
            getPostById: jest.fn(),
            updatePostById: jest.fn(),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: jest.fn(),
              },
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPostComponent);
    component = fixture.componentInstance;
    apiClientService = TestBed.inject(ApiClientService);
    router = TestBed.inject(Router);
    fixture.detectChanges(); // Trigger initial data binding
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch post data on initialization', () => {
    const mockPost = { title: 'Test Title', body: 'Test Body' };
    jest.spyOn(apiClientService, 'getPostById').mockReturnValue(of(mockPost));
    jest
      .spyOn((<any>TestBed.inject(ActivatedRoute)).snapshot.paramMap, 'get')
      .mockReturnValue('1');

    component.ngOnInit();

    expect(apiClientService.getPostById).toHaveBeenCalledWith(1);
    expect(component.post).toEqual(mockPost);
  });

  it('should navigate to /posts on successful post update', () => {
    jest.spyOn(apiClientService, 'updatePostById').mockReturnValue(of({}));
    jest.spyOn(router, 'navigate');

    component.post = { title: 'Updated Title', body: 'Updated Body' };
    jest
      .spyOn((<any>TestBed.inject(ActivatedRoute)).snapshot.paramMap, 'get')
      .mockReturnValue('1');

    component.onSubmit();

    expect(apiClientService.updatePostById).toHaveBeenCalledWith(
      1,
      component.post
    );
    expect(router.navigate).toHaveBeenCalledWith(['/posts']);
  });
});

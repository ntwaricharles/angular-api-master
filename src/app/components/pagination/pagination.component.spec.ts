import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaginationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger initial data binding
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit previous page when previousPage() is called and currentPage > 1', () => {
    component.currentPage = 2;
    component.totalPages = 5;

    spyOn(component.pageChange, 'emit'); // Spy on the pageChange emitter

    component.previousPage();

    expect(component.pageChange.emit).toHaveBeenCalledWith(1); // Should emit page 1
  });

  it('should not emit previous page when previousPage() is called and currentPage is 1', () => {
    component.currentPage = 1;
    component.totalPages = 5;

    spyOn(component.pageChange, 'emit'); // Spy on the pageChange emitter

    component.previousPage();

    expect(component.pageChange.emit).not.toHaveBeenCalled();
  });

  it('should emit next page when nextPage() is called and currentPage < totalPages', () => {
    component.currentPage = 1;
    component.totalPages = 5;

    spyOn(component.pageChange, 'emit'); // Spy on the pageChange emitter

    component.nextPage();

    expect(component.pageChange.emit).toHaveBeenCalledWith(2); // Should emit page 2
  });

  it('should not emit next page when nextPage() is called and currentPage is equal to totalPages', () => {
    component.currentPage = 5;
    component.totalPages = 5;

    spyOn(component.pageChange, 'emit'); // Spy on the pageChange emitter

    component.nextPage();

    expect(component.pageChange.emit).not.toHaveBeenCalled();
  });
});

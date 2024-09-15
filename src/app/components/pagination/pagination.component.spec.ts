import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaginationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('previousPage', () => {
    it('should emit previous page number when currentPage is greater than 1', () => {
      component.currentPage = 2;
      component.totalPages = 5;
      spyOn(component.pageChange, 'emit');

      component.previousPage();

      expect(component.pageChange.emit).toHaveBeenCalledWith(1);
    });

    it('should not emit any event when currentPage is 1', () => {
      component.currentPage = 1;
      spyOn(component.pageChange, 'emit');

      component.previousPage();

      expect(component.pageChange.emit).not.toHaveBeenCalled();
    });
  });

  describe('nextPage', () => {
    it('should emit next page number when currentPage is less than totalPages', () => {
      component.currentPage = 2;
      component.totalPages = 5;
      spyOn(component.pageChange, 'emit');

      component.nextPage();

      expect(component.pageChange.emit).toHaveBeenCalledWith(3);
    });

    it('should not emit any event when currentPage is equal to totalPages', () => {
      component.currentPage = 5;
      component.totalPages = 5;
      spyOn(component.pageChange, 'emit');

      component.nextPage();

      expect(component.pageChange.emit).not.toHaveBeenCalled();
    });
  });
});

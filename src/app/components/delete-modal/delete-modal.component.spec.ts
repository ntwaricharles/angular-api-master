import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteModalComponent } from './delete-modal.component';

describe('DeleteModalComponent', () => {
  let component: DeleteModalComponent;
  let fixture: ComponentFixture<DeleteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('openModal', () => {
    it('should set isVisible to true', () => {
      component.openModal();
      expect(component.isVisible).toBe(true);
    });
  });

  describe('closeModal', () => {
    it('should set isVisible to false and emit onCancel', () => {
      component.isVisible = true; // Set to true to simulate the modal being open
      spyOn(component.onCancel, 'emit');

      component.closeModal();

      expect(component.isVisible).toBe(false);
      expect(component.onCancel.emit).toHaveBeenCalled();
    });
  });

  describe('confirmDelete', () => {
    it('should set isVisible to false and emit onConfirm', () => {
      component.isVisible = true; // Set to true to simulate the modal being open
      spyOn(component.onConfirm, 'emit');

      component.confirmDelete();

      expect(component.isVisible).toBe(false);
      expect(component.onConfirm.emit).toHaveBeenCalled();
    });
  });
});

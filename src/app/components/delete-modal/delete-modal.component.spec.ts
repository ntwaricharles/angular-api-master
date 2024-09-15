import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteModalComponent } from './delete-modal.component';

describe('DeleteModalComponent', () => {
  let component: DeleteModalComponent;
  let fixture: ComponentFixture<DeleteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the modal', () => {
    component.openModal();
    expect(component.isVisible).toBe(true);
  });

  it('should close the modal and emit cancel event', () => {
    jest.spyOn(component.onCancel, 'emit');

    component.closeModal();
    expect(component.isVisible).toBeFalsy();
    expect(component.onCancel.emit).toHaveBeenCalled();
  });

  it('should confirm delete and emit confirm event', () => {
    jest.spyOn(component.onConfirm, 'emit');

    component.confirmDelete();
    expect(component.isVisible).toBeFalsy();
    expect(component.onConfirm.emit).toHaveBeenCalled();
  });
});

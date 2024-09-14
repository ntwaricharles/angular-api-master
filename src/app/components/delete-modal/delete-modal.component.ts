import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.css'],
})
export class DeleteModalComponent {
  isVisible = false;
  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  openModal() {
    this.isVisible = true;
  }

  closeModal() {
    this.isVisible = false;
    this.onCancel.emit();
  }

  confirmDelete() {
    this.isVisible = false;
    this.onConfirm.emit();
  }
}

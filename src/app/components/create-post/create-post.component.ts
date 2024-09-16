import { Component } from '@angular/core';
import { ApiClientService } from '../../services/api-client.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent {
  post = {
    title: '',
    body: '',
  };

  loading = false;
  successMessage = '';
  errorMessage = '';
  validationError = '';

  constructor(private apiClient: ApiClientService) {}

  onSubmit() {
    if (!this.isFormValid()) {
      
      this.validationError = 'All fields are required!';
      return;
    }

    this.loading = true; 
    this.validationError = '';

    setTimeout(() => {
      this.apiClient.createPost(this.post).subscribe(
        (data) => {
          this.successMessage = 'Post created successfully!';
          this.errorMessage = '';
          this.resetForm();
          this.loading = false; 
        },
        (error) => {
          this.errorMessage = 'Failed to create post. Please try again.';
          this.successMessage = '';
          this.loading = false;
        }
      );
    }, 1000); 
   
  }

  isFormValid(): boolean {
    return this.post.title.trim() !== '' && this.post.body.trim() !== '';
  }

  resetForm() {
    this.post = {
      title: '',
      body: '',
    };
  }
}

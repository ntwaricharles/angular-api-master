import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiClientService } from '../../services/api-client.service';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css'],
})
export class EditPostComponent implements OnInit {
  post: any = { title: '', body: '' };
  loading = false;
  successMessage = ''; 
  errorMessage = ''; 
  validationError = ''; 

  constructor(
    private route: ActivatedRoute,
    private apiClient: ApiClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const postId = +this.route.snapshot.paramMap.get('id')!;
    this.apiClient.getPostById(postId).subscribe(
      (data) => {
        this.post = data;
      },
      (error) => {
        this.errorMessage = 'Failed to load post data.';
      }
    );
  }

  onSubmit() {
    if (!this.isFormValid()) {
      this.validationError = 'All fields are required!';
      return;
    }

    this.loading = true; 
    this.validationError = ''; 

    setTimeout(() => {
      const postId = +this.route.snapshot.paramMap.get('id')!;
      this.apiClient.updatePostById(postId, this.post).subscribe(
        () => {
          this.successMessage = 'Post updated successfully!';
          this.errorMessage = '';
          this.loading = false; 
          this.router.navigate(['/posts']);
        },
        (error) => {
          this.errorMessage = 'Failed to update post. Please try again.';
          this.successMessage = '';
          this.loading = false;
        }
      );
    }, 500);
  }

  isFormValid(): boolean {
    return this.post.title.trim() !== '' && this.post.body.trim() !== '';
  }
}

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

  constructor(private apiClient: ApiClientService) {}

  onSubmit() {
    this.apiClient.createPost(this.post).subscribe((data) => {
      alert('Post created successfully!');
    });
  }
}

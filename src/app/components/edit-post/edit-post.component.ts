import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiClientService } from '../../services/api-client.service';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css'],
})
export class EditPostComponent implements OnInit {
  post: any = {
    title: '',
    body: '',
  }; // Holds the post data

  constructor(
    private route: ActivatedRoute,
    private apiClient: ApiClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const postId = +this.route.snapshot.paramMap.get('id')!;
    this.apiClient.getPost(postId).subscribe((data) => {
      this.post = data; // Populate the post data in the form
    });
  }

  onSubmit() {
    const postId = +this.route.snapshot.paramMap.get('id')!;
    this.apiClient.updatePost(postId, this.post).subscribe(() => {
      alert('Post updated successfully!');
      this.router.navigate(['/posts']); // Redirect to posts list after update
    });
  }
}

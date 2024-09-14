import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiClientService } from '../../services/api-client.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css'],
})
export class PostDetailComponent implements OnInit {
  post: any;
  comments: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private apiClient: ApiClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const postId = +this.route.snapshot.paramMap.get('id')!;
    this.apiClient.getPost(postId).subscribe((data) => {
      this.post = data;
    });
    this.apiClient.getPostComments(postId).subscribe((data: any[]) => {
      this.comments = data;
    });
  }

  // Method to confirm and delete the post
  confirmDelete(postId: number): void {
    if (confirm('Are you sure you want to delete this post?')) {
      this.deletePost(postId);
    }
  }

  // Method to delete the post
  deletePost(postId: number): void {
    this.apiClient.deletePost(postId).subscribe(() => {
      alert('Post deleted successfully!');
      this.router.navigate(['/posts']); // Redirect to posts list after deletion
    });
  }
}

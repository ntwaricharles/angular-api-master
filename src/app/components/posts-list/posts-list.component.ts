import { Component, OnInit } from '@angular/core';
import { ApiClientService } from '../../services/api-client.service';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.css'],
})
export class PostsListComponent implements OnInit {
  posts: any[] = [];
  currentPage: number = 1;
  totalPages: number = 10;

  constructor(private apiClient: ApiClientService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    const limit = 10;
    this.apiClient
      .getPosts(this.currentPage, limit)
      .subscribe((data: any[]) => {
        this.posts = data;
      });
  }

  // Confirm delete action
  confirmDelete(postId: number): void {
    if (confirm('Are you sure you want to delete this post?')) {
      this.deletePost(postId);
    }
  }

  // Delete post by ID
  deletePost(postId: number): void {
    this.apiClient.deletePost(postId).subscribe(() => {
      alert('Post deleted successfully!');
      this.loadPosts(); // Reload posts after deletion
    });
  }

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.loadPosts();
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiClientService } from '../../services/api-client.service';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.css'],
})
export class PostsListComponent implements OnInit {
  posts: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  postsPerPage: number = 10; // Limit posts per page
  totalPosts: number = 0;
  postIdToDelete: number | null = null;
  @ViewChild('deleteModal') deleteModal!: DeleteModalComponent;

  constructor(private apiClient: ApiClientService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.apiClient
      .getPosts(this.currentPage, this.postsPerPage)
      .subscribe((data: any[]) => {
        this.posts = data;
        this.apiClient.getPosts().subscribe((allPosts: any[]) => {
          this.totalPosts = allPosts.length; // Get the total number of posts
          this.totalPages = Math.ceil(this.totalPosts / this.postsPerPage); // Calculate total pages
        });
      });
  }

  openDeleteModal(postId: number): void {
    this.postIdToDelete = postId;
    this.deleteModal.openModal();
  }

  cancelDelete(): void {
    this.postIdToDelete = null;
  }

  deletePost(): void {
    if (this.postIdToDelete !== null) {
      this.apiClient.deletePostById(this.postIdToDelete).subscribe(() => {
        this.loadPosts(); // Reload posts after deletion
        this.postIdToDelete = null;
      });
    }
  }

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.loadPosts(); // Load posts for the selected page
  }
}

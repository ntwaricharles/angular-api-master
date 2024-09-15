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
  totalPages: number = 10;
  postIdToDelete: number | null = null;
  @ViewChild('deleteModal') deleteModal!: DeleteModalComponent;

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
    this.loadPosts();
  }
}

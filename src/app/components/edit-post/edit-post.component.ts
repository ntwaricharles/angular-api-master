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

  constructor(
    private route: ActivatedRoute,
    private apiClient: ApiClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const postId = +this.route.snapshot.paramMap.get('id')!;
    this.apiClient.getPostById(postId).subscribe((data) => {
      this.post = data; // Populate form with post data
    });
  }

  onSubmit() {
    const postId = +this.route.snapshot.paramMap.get('id')!;
    this.apiClient.updatePostById(postId, this.post).subscribe(() => {
      this.router.navigate(['/posts']); 
    });
  }
}

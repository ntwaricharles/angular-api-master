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
  comments$: any;
  post$: any;

  constructor(
    private route: ActivatedRoute,
    private apiClient: ApiClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const postId = +this.route.snapshot.paramMap.get('id')!;
    this.apiClient.getPostById(postId).subscribe((data) => {
      this.post = data;
    });
    this.apiClient.getPostComments(postId).subscribe((data: any[]) => {
      this.comments = data;
    });
  }

}

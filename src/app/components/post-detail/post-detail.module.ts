import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostDetailComponent } from './post-detail.component';
import { PostDetailRoutingModule } from './post-detail-routing.module';

@NgModule({
  declarations: [PostDetailComponent],
  imports: [CommonModule, PostDetailRoutingModule],
})
export class PostDetailModule {}

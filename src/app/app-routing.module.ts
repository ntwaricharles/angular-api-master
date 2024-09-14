import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostsListComponent } from './components/posts-list/posts-list.component';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { EditPostComponent } from './components/edit-post/edit-post.component';

const routes: Routes = [
  { path: '', redirectTo: '/posts', pathMatch: 'full' }, // Default route
  { path: 'posts', component: PostsListComponent }, // Posts list
  { path: 'post/create', component: CreatePostComponent }, // Create post
  { path: 'post/edit/:id', component: EditPostComponent }, // Edit post
  {
    path: 'post/:id', // Lazy load PostDetailModule
    loadChildren: () =>
      import('./components/post-detail/post-detail.module').then(
        (m) => m.PostDetailModule
      ),

  },
  { path: '**', redirectTo: '/posts' }, // Fallback route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

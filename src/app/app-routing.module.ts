import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostsListComponent } from './components/posts-list/posts-list.component';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { EditPostComponent } from './components/edit-post/edit-post.component';

const routes: Routes = [
  { path: '', redirectTo: '/posts', pathMatch: 'full' },
  { path: 'posts', component: PostsListComponent },
  { path: 'post/create', component: CreatePostComponent },
  { path: 'post/edit/:id', component: EditPostComponent },
  {
    path: 'post/:id',
    loadChildren: () =>
      import('./components/post-detail/post-detail.module').then(
        (m) => m.PostDetailModule
      ),

  },
  { path: '**', redirectTo: '/posts' }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

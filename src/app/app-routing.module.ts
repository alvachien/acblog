import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BlogComponent } from './blog/blog.component';
import { BlogListComponent } from './blog-list/blog-list.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'blogbycoll/:collid', component: BlogListComponent },
  { path: 'blogbydate/:datestr', component: BlogListComponent },
  { path: 'blogbymonth/:datestr', component: BlogListComponent },
  { path: 'blogbytag/:tagname', component: BlogListComponent },
  { path: 'blog/:id', component: BlogComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

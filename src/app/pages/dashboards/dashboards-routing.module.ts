import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Component Pages
import { JobComponent } from './job/job.component';
import { DashboardBlogComponent } from './dashboard-blog/dashboard-blog.component';

const routes: Routes = [
  {
    path: "job",
    component: JobComponent
  },
  {
    path: "dashboard-blog",
    component: DashboardBlogComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DashboardsRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReviewComponent } from './review.component';

const routes: Routes = [
  {
    path: '',
    component: ReviewComponent,
    data: {
      title: 'REVIEW',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReviewRoutingModule {}

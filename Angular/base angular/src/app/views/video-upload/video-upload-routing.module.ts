import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VideoUploadComponent } from './video-upload.component';

const routes: Routes = [
  {
    path: '',
    component: VideoUploadComponent,
    data: {
      title: 'Video Upload',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VideoUploadRoutingModule {}

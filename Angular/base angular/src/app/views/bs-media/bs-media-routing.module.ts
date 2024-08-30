import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BsMediaListComponent } from './bs-media-list/bs-media-list.component';
import { BsMediaComponent } from './bs-media.component';

const routes: Routes = [
  {
    path: '',
    component: BsMediaComponent,
    data: {
      title: 'MANAGE_BS_MEDIA',
    },
    children: [
      {
        path: 'list',
        component: BsMediaListComponent,
        data: {
          title: 'BS_MEDIA_LIST',
          permission: 'BS_MEDIA_LIST',
        },
      },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BsMediaRoutingModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxFlowModule, FlowInjectionToken } from '@flowjs/ngx-flow';
import Flow from '@flowjs/flow.js';

import { VideoUploadRoutingModule } from './video-upload-routing.module';
import { VideoUploadComponent } from './video-upload.component';
import { FormsModule } from '@angular/forms';
import { LoaderModule } from '../../containers';

@NgModule({
  declarations: [VideoUploadComponent],
  imports: [CommonModule, FormsModule, LoaderModule, VideoUploadRoutingModule, NgxFlowModule],
  providers: [
    {
      provide: FlowInjectionToken,
      useValue: Flow,
    },
  ],
})
export class VideoUploadModule {}

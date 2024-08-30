import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ChatComponent } from './chat.component';

@NgModule({
  declarations: [ChatComponent],
  imports: [CommonModule, PickerModule, PerfectScrollbarModule],
  exports: [ChatComponent],
})
export class ChatModule {}

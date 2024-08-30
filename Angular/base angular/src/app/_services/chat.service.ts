import { ComponentRef, Injectable } from '@angular/core';
import { ChatComponent } from './../_components/chat/chat.component';
import { CommonChatService } from './common-chat.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private common: CommonChatService) {}
  openChat() {
    this.loadChatComponentDynamically();
  }

  loadChatComponentDynamically() {
    this.common.chatInitiate.emit({});
  }
  removeLoadedComponent(viewRef: ComponentRef<ChatComponent>) {
    this.common.chatClose.emit(viewRef);
  }
}

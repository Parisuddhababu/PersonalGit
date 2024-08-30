import { DOCUMENT } from '@angular/common';
import { Component, ComponentRef, Inject, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ChatType, ModuleType } from './../../config/app-constants';
import { ChatService } from './../../_services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChatComponent implements OnInit, OnDestroy {
  readonly chatTypes = ChatType;
  readonly moduleTypes = ModuleType;

  // Input Data
  @Input() module = ModuleType.POPUP;
  @Input() type = ChatType.ONE_TO_ONE;

  showGroupDetailsSection = false;
  enableDarkMode = false;
  showEmojiPicker = false;

  // Component Ref used when chat component dynamically loaded
  componentRef: ComponentRef<ChatComponent> = null;
  constructor(@Inject(DOCUMENT) private document: Document, private chatSerivce: ChatService) {}

  ngOnDestroy(): void {
    this.toggleDarkMode(true);
    this.toggleEmoji(true);
  }

  ngOnInit(): void {}
  toggleDetails() {
    this.showGroupDetailsSection = !this.showGroupDetailsSection;
  }
  toggleDarkMode(forceRemove = false) {
    if (forceRemove === true) {
      this.enableDarkMode = false;
      return;
    }
    this.enableDarkMode = !this.enableDarkMode;
  }

  addEmoji(event, msgInput: HTMLInputElement) {
    let val = msgInput.value || '';
    val += event.emoji.native;
    msgInput.value = val;
  }
  toggleEmoji(forceRemove = false) {
    if (forceRemove === true) {
      this.showEmojiPicker = false;
      return;
    }
    this.showEmojiPicker = !this.showEmojiPicker;
  }
  closeChat() {
    this.chatSerivce.removeLoadedComponent(this.componentRef);
  }
}

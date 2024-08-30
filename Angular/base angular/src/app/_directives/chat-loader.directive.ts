import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appChatLoader]',
})
export class ChatLoaderDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}

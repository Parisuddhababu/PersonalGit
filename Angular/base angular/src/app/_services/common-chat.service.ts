import { EventEmitter, Injectable, Output } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class CommonChatService {
  @Output() chatInitiate: EventEmitter<any> = new EventEmitter<any>();
  @Output() chatClose: EventEmitter<any> = new EventEmitter<any>();
  @Output() chatContainerClear: EventEmitter<any> = new EventEmitter<any>();
}

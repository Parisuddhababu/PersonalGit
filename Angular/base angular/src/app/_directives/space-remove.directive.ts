import { Directive, ElementRef, HostListener, Input, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import * as _ from 'lodash';
@Directive({
  selector: '[appSpaceRemove]',
})
export class SpaceRemoveDirective {
  @Input() disableTrim = false;
  constructor(private el: ElementRef, @Self() private ngControl: NgControl) {}

  @HostListener('focusout', ['$event'])
  public onFoucOut(event) {
    if (this.disableTrim) return;
    const currentCursorPosition = this.el.nativeElement.selectionStart;
    const leadingSpaces = this.el.nativeElement.value.search(/\S|$/);
    let index = currentCursorPosition - leadingSpaces;
    // this.el.nativeElement.value = _.trim(this.el.nativeElement.value);
    this.ngControl.control.setValue(_.trim(this.el.nativeElement.value));
    if (index < 0) index = _.trim(this.el.nativeElement.value).length - 1;
    this.setCaretPosition(index);
  }

  setCaretPosition = (caretPos) => {
    const elem = this.el.nativeElement;
    if (elem.createTextRange) {
      const range = elem.createTextRange();
      range.move('character', caretPos);
      range.select();
    }
  };
}

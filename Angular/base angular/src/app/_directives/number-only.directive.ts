import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';
@Directive({
  selector: 'input[appNumberOnly]',
})
export class NumberOnlyDirective {
  @Input()
  allowFloatingPoint = false;
  @Input() decimals = 0;
  constructor(private el: ElementRef) {}

  @HostListener('keypress', ['$event']) onInputChange(event) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && !(charCode === 46 && this.allowFloatingPoint)) {
      return false;
    }
    if (this.allowFloatingPoint && this.decimals > 0) {
      const value = this.el.nativeElement.value + String.fromCharCode(charCode);
      const regExpString = '^\\s*((\\d+(\\.\\d{0,' + this.decimals + '})?)|((\\d*(\\.\\d{1,' + this.decimals + '}))))\\s*$';
      return new RegExp(regExpString).test(value);
    }
    return true;
  }
}

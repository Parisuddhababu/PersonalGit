import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { debounceTime, take } from 'rxjs/operators';
@Directive({
  selector: '[InvalidFormScrollNGFormDirective]',
})
export class InvalidFormScrollNGFormDirective {
  constructor(private el: ElementRef, private formGroupDir: NgForm) {}
  @HostListener('ngSubmit') onSubmit() {
    if (this.formGroupDir.invalid) {
      this.scrollToFirstInvalidControl();
    }
  }
  private scrollToFirstInvalidControl() {
    const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector('.ng-invalid');
    window.scroll({
      top: this.getTopOffset(firstInvalidControl) - 100,
      left: 0,
      behavior: 'smooth',
    });

    fromEvent(window, 'scroll')
      .pipe(debounceTime(100), take(1))
      .subscribe(() => firstInvalidControl.focus());
  }

  private getTopOffset(controlEl: HTMLElement): number {
    const labelOffset = 50;
    const controlElTop = controlEl.getBoundingClientRect().top;

    const absoluteControlElTop = controlElTop + window.scrollY;

    return absoluteControlElTop - labelOffset;
  }
}

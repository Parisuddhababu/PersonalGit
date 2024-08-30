import { AfterViewInit, ChangeDetectorRef, Directive, ElementRef, Host, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ResizeSensor } from 'css-element-queries';

@Directive({
  selector: 'ngx-datatable',
})
export class DataTableKeyPressScrollDirective implements OnDestroy, AfterViewInit, OnInit {
  @ViewChild('datatable-body', { static: false }) dtBody;
  isCursorOnDiv = false;
  private resizeSensor: ResizeSensor;
  constructor(private el: ElementRef, @Host() private self: DatatableComponent, public ref: ChangeDetectorRef) {
    this.el.nativeElement.tabIndex = 0;
    (this.el.nativeElement as HTMLDivElement).classList.add('datatable-div');
    this.self.virtualization = false;
  }
  ngOnInit() {
    if (ResizeSensor) {
      this.resizeSensor = new ResizeSensor(this.el.nativeElement, () => {
        window.dispatchEvent(new Event('resize'));
      });
    }
  }
  ngAfterViewInit() {
    this.el.nativeElement.querySelector('datatable-body').addEventListener('scroll', this.scroll, true);
  }

  scroll = (event): void => {
  };

  @HostListener('mouseenter', ['$event'])
  onMouseEnter(e) {
    e.preventDefault();
    if (this.isCursorOnDiv === false) {
      this.focusDiv();
    }
    this.isCursorOnDiv = true;
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave() {
    this.isCursorOnDiv = false;
  }

  @HostListener('click', ['$event'])
  onClick(e) {
    // For resolved checkbox selection issue
    if (e.target && e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
      return true;
    }
    e.preventDefault();
    const selection = window.getSelection();
    let range = null;
    if (selection.type !== 'None') {
      range = selection.getRangeAt(0);
    }
    this.focusDiv();
    if (range) {
      window.getSelection().addRange(range);
    }
  }

  private focusDiv() {
    // this.el.nativeElement.focus({ preventScroll: true });
    const x = window.scrollX,
      y = window.scrollY; // save position
    this.el.nativeElement.focus();
    window.scrollTo(x, y); // restore position
  }

  @HostListener('document:keydown', ['$event'])
  onKeyPress(event) {
    const keyCode = event.keyCode;
    if (this.isCursorOnDiv) {
      if (keyCode === 37) {
        this.scrollLeft();
      }
      if (keyCode === 39) {
        this.scrollRight();
      }
    }
  }

  public scrollRight(): void {
    this.el.nativeElement.querySelector('datatable-body').scrollLeft =
      this.el.nativeElement.querySelector('datatable-body').scrollLeft + 150;
  }

  public scrollLeft(): void {
    this.el.nativeElement.querySelector('datatable-body').scrollLeft =
      this.el.nativeElement.querySelector('datatable-body').scrollLeft - 150;
  }

  ngOnDestroy() {
    this.el.nativeElement.querySelector('datatable-body').removeEventListener('scroll', this.scroll, true);
    if (this.resizeSensor) {
      this.resizeSensor.detach();
    }
  }

  // VEN-1230: Release 4 - Admin Buyer- The title bar should be freeze for all users (Admin, Buyer 7 Seller)
  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event) {
    const header = this.el.nativeElement.querySelector('datatable-header');
    const dtbody = this.el.nativeElement.querySelector('datatable-body');
    if (!header || !dtbody) return;
    const headerHeight = document.querySelector('app-header');
    const sticky = headerHeight.getBoundingClientRect().height + 30;

    if (dtbody.getBoundingClientRect().y < sticky) {
      header.classList.add('sticky-dt-header');
    } else {
      header.classList.remove('sticky-dt-header');
    }
  }
}

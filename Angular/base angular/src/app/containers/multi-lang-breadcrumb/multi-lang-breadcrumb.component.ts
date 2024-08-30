import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { BreadcrumbService } from './breadcrumb.service';
import { Replace } from './replace';

@Component({
  selector: 'app-multi-lang-breadcrumb',
  templateUrl: './multi-lang-breadcrumb.component.html',
  styleUrls: ['./multi-lang-breadcrumb.component.scss'],
})
export class MultiLangBreadcrumbComponent implements OnInit, OnDestroy {
  @Input() fixed: boolean;
  public breadcrumbs: any;
  private readonly fixedClass = 'breadcrumb-fixed';

  constructor(
    @Inject(DOCUMENT) private document: any,
    private renderer: Renderer2,
    public service: BreadcrumbService,
    public el: ElementRef
  ) {}

  public ngOnInit(): void {
    Replace(this.el);
    this.isFixed(this.fixed);
    this.breadcrumbs = this.service.breadcrumbs;
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, this.fixedClass);
  }

  isFixed(fixed: boolean = this.fixed): void {
    if (fixed) {
      this.renderer.addClass(this.document.body, this.fixedClass);
    }
  }
}

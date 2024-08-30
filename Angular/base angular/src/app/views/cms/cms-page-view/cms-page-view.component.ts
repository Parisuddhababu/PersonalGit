import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { CmsService } from '../../../_services/cms.service';
import { EncrDecrService } from '../../../_services/encr-decr.service';
import { LoggerService } from './../../../_services/logger.service';
@Component({
  selector: 'app-cms-page-view',
  templateUrl: './cms-page-view.component.html',
  styleUrls: ['./cms-page-view.component.scss'],
})
export class CmsPageViewComponent implements OnInit {
  cmsId: any;
  private routeSub: Subscription;
  editMode: Boolean = false;
  private editCmsId: number;
  authToken = '';
  editors: any;
  htmldata;
  cssdata;
  isData = true;
  constructor(private cmsService: CmsService, private route: ActivatedRoute, private el: ElementRef, private EncrDecr: EncrDecrService,
    private logger: LoggerService) { }
  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params) => {
      this.cmsId = params['id'];
      this.editMode = params['id'] !== undefined;
      setTimeout(() => {
        this.getTemplateData();
      }, 100);
    });
  }
  getTemplateData() {
    if (this.editMode) {
      this.cmsService
        .getCmsTemplate(this.cmsId)
        .pipe(first())
        .subscribe(
          (response) => {
            this.htmldata = response['gjs-html'];
            this.cssdata = response['gjs-css'];
            if (this.cssdata) {
              // Add dynamic CSS
              const style = document.createElement('style');
              style.setAttribute('id', 'customStyle');
              style.innerHTML = this.cssdata;
              this.el.nativeElement.appendChild(style);
              // document.body.appendChild(style);
            }
          },
          (error) => {
            this.logger.error(error);
          }
        );
    }
  }
}

import { Injector } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { EncrDecrService } from '../_services/encr-decr.service';
import { FilterStorageService } from '../_services/filter-storage.service';
import { LoaderService } from '../_services/loader.service';
import { MultilingualService } from '../_services/multilingual.service';
import { LoggerService } from './../_services/logger.service';

export class BaseServiceInjector {
  static injector: Injector;
  protected filterService: FilterStorageService;
  protected modalService: BsModalService;
  protected loader: LoaderService;
  protected toastr: ToastrService;
  protected router: Router;
  public translateService: TranslateService;
  protected multilingualService: MultilingualService;
  protected EncrDecr: EncrDecrService;
  protected logger: LoggerService;

  constructor() {
    this.modalService = BaseServiceInjector.injector.get(BsModalService);
    this.filterService = BaseServiceInjector.injector.get(FilterStorageService);
    this.loader = BaseServiceInjector.injector.get(LoaderService);
    this.toastr = BaseServiceInjector.injector.get(ToastrService);
    this.router = BaseServiceInjector.injector.get(Router);
    this.translateService = BaseServiceInjector.injector.get(TranslateService);
    this.multilingualService = BaseServiceInjector.injector.get(MultilingualService);
    this.EncrDecr = BaseServiceInjector.injector.get(EncrDecrService);
    this.logger = BaseServiceInjector.injector.get(LoggerService);
  }
}

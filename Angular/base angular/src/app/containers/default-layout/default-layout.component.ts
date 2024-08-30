import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { CONFIGCONSTANTS } from '../../config/app-constants';
import { LanguageService } from '../../_services/language.service';
import { AuthenticationService } from './../../_services/authentication.service';
import { ChatService } from './../../_services/chat.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
})
export class DefaultLayoutComponent implements OnInit {
  modalRef: BsModalRef;
  private subscription: Subscription;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;
  private Language = localStorage.getItem('lan') || 'en';
  appTitle: String = CONFIGCONSTANTS.siteName;
  favImg: String = 'assets/img/brand/angular_logo_small.png';
  logoImg: String = 'assets/img/brand/angular_logo.png';
  public currYear = moment().format('YYYY');
  fullname: String = '';
  settings: any;
  currentState: string;
  prevState: string;
  prevUrl: string;
  languageOption: boolean = CONFIGCONSTANTS.languageOption;
  constructor(
    private modalService: BsModalService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private languageSwitcher: LanguageService,
    private chatService: ChatService
  ) {
    // set default language if language option is disabled
    this.Language = !this.languageOption ? 'en' : this.Language;

    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = document.body.classList.contains('sidebar-minimized');
    });

    this.changes.observe(<Element>this.element, {
      attributes: true,
    });

    this.subscription = this.languageSwitcher.getLanguage().subscribe((lan) => {
      this.translate.setDefaultLang(lan);
      this.translate.use(lan);
      this.Language = lan;
    });
    this.languageSwitcher.changeLanguage(this.Language);
  }

  openChat() {
    this.chatService.openChat();
  }
  ngOnInit(): void {
    this.fullname = localStorage.getItem('fullName');
    this.settings = localStorage.getItem('settings');
    if (this.settings) {
      this.settings = JSON.parse(this.settings);
      this.appTitle = this.settings.sitename;
      this.favImg = this.settings.favicon;
      this.logoImg = this.settings.logo;
    }
    const classname = document.getElementsByClassName('dropdown');
    const onDropdownClick = function (e) {
      this.classList.toggle('active');
    };
    for (let i = 0; i < classname.length; i++) {
      classname[i].addEventListener('click', onDropdownClick, false);
    }
  }

  public changeLanguage(lan: string) {
    this.languageSwitcher.changeLanguage(lan);
    this.translate.use(lan);
  }

  onLogout() {
    this.decline();
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }
  decline(): void {
    this.modalRef.hide();
  }
}

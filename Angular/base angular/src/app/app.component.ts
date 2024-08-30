import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { filter, first, map, mergeMap } from 'rxjs/operators';
import { CONFIGCONSTANTS } from './config/app-constants';
import { ChatComponent } from './_components/chat/chat.component';
import { ChatLoaderDirective } from './_directives/chat-loader.directive';
import { CommonChatService } from './_services/common-chat.service';
import { EncrDecrService } from './_services/encr-decr.service';
import { GoogleAnalyticsService } from './_services/google-analytics.service';
import { SettingsService } from './_services/settings-service';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: `
    <router-outlet></router-outlet>
    <div class="v-wrapper chat-container">
      <div class="main">
        <div class="container-fluid p-0 chat-box-continer">
          <ng-template appChatLoader> </ng-template>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .container-fluid.chat-box-continer {
        display: flex;
        justify-content: flex-end;
        position: fixed;
        width: 100%;
        bottom: 0;
        right: 0;
        z-index: 99999999;
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  appTitle: string = CONFIGCONSTANTS.siteName;
  fullTitle: string;

  // load chat
  @ViewChild(ChatLoaderDirective, { static: true }) appChatLoader: ChatLoaderDirective;

  chatInitialSubscription: Subscription;
  chatCloseSubscription: Subscription;
  chatClearSubscription: Subscription;

  constructor(
    private router: Router,
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
    private settingsservice: SettingsService,
    private EncrDecr: EncrDecrService,
    private translate: TranslateService,
    private common: CommonChatService,
    public viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    GoogleAnalyticsService.loadGoogleAnalytics();

    this.chatInitialSubscription = this.common.chatInitiate.subscribe((data: any) => {
      this.loadChatComponent(data);
    });
    this.chatCloseSubscription = this.common.chatClose.subscribe((data: ComponentRef<ChatComponent>) => {
      this.removeComponent(data);
    });
    this.chatClearSubscription = this.common.chatContainerClear.subscribe(() => {
      this.appChatLoader.viewContainerRef.clear();
    });
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      GoogleAnalyticsService.visitPage();
      window.scrollTo(0, 0);
    });
    this.getImageData();
    // set dynamic html title
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute.firstChild;
          let child = route;
          while (child) {
            if (child.firstChild) {
              child = child.firstChild;
              route = child;
            } else {
              child = null;
            }
          }
          return route;
        }),
        mergeMap((route) => route.data)
      )
      .subscribe((data) => {
        // Responsive - Mobile app - After selecting the module Navigation menubar should be closed
        this.toggleMenu();
        if (data.title) {
          this.translate.get(data.title).subscribe((translateResp) => {
            this.fullTitle = this.appTitle + ' | ' + translateResp;
            this.titleService.setTitle(this.fullTitle);
          });
        } else {
          this.fullTitle = this.appTitle;
          this.titleService.setTitle(this.fullTitle);
        }
      });
  }
  toggleMenu() {
    const element = document.getElementsByTagName('body');
    element[0].classList.remove('sidebar-show');
  }
  getImageData() {
    this.settingsservice
      .getSettingsImageDataURL()
      .pipe(first())
      .subscribe((data: any) => {
        let logoURL, faviconURL;
        this.appTitle = data.data.site_name ? data.data.site_name : CONFIGCONSTANTS.siteName;
        if (data.data.logo) {
          logoURL = data.data.logo;
        }
        if (data.data.favicon32) {
          faviconURL = data.data.favicon32;
          this.settingsservice.changeFavicon(faviconURL);
        }
        this.settingsservice.setSettingsData(this.appTitle, logoURL, faviconURL);
      });
  }

  loadChatComponent(data: any) {
    // this.appChatLoader.viewContainerRef.clear();
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ChatComponent);
    const componentRef = this.appChatLoader.viewContainerRef.createComponent<ChatComponent>(componentFactory);
    componentRef.instance.componentRef = componentRef;
  }
  removeComponent(data: ComponentRef<ChatComponent>) {
    this.appChatLoader.viewContainerRef.remove(this.appChatLoader.viewContainerRef.indexOf(data.hostView));
  }
}

import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageModel, MyMessageModel } from 'src/app/models/message.model';
import { PrivateMessageService } from 'src/app/services/private-message.service';
import jwt_decode from "jwt-decode";
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { VerticalNavigationComponent } from '../shared/vertical-header/vertical-navigation.component';
import { VerticalSidebarComponent } from '../shared/vertical-sidebar/vertical-sidebar.component';
import { BreadcrumbComponent } from '../shared/breadcrumb/breadcrumb.component';
import { HorizontalSidebarComponent } from '../shared/horizontal-sidebar/horizontal-sidebar.component';
import { HorizontalNavigationComponent } from '../shared/horizontal-header/horizontal-navigation.component';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-full-layout',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.scss'],
  standalone: true,
  imports: [
    CdkScrollableModule,
    CommonModule,
    RouterModule,
    NgbModule,
    TranslateModule,
    HorizontalNavigationComponent,
    VerticalNavigationComponent,
    HorizontalSidebarComponent,
    VerticalSidebarComponent,
    BreadcrumbComponent
  ]
})
export class FullComponent implements OnInit, OnDestroy {
  active = 1;
  hiddenHeader = "hidden"
  isMobileDevice = false;
  private routeSubscription: Subscription;
  token: string | null = null;
  pageName: string | null = null;
  lang: string | null = null;
  moduleName: string | null = null;
  constructor(public router: Router, private privateService: PrivateMessageService, private translateService: TranslateService, private activatedRoute: ActivatedRoute) {
    // ตรวจสอบว่าเป็นอุปกรณ์มือถือหรือแท็บเล็ตหรือไม่
    const userAgent = navigator.userAgent.toLowerCase();
    this.isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  }

  tabStatus = 'justified';

  public isCollapsed = false;

  public innerWidth: any;
  public defaultSidebar: any;
  public showSettings = false;
  public showMobileMenu = false;
  public expandLogo = false;
  messageModel: MessageModel[] = []

  options = {
    dir: 'ltr', // two possible values: ltr, rtl
    layout: 'vertical', // two possible values: vertical, horizontal
    sidebartype: 'full', // four possible values: full, iconbar, overlay, mini-sidebar
  };

  Logo() {
    this.expandLogo = !this.expandLogo;
  }

  ngOnInit() {
    this.routeSubscription = this.activatedRoute.paramMap.subscribe(params => {
      this.token = params.get('token');
      this.pageName = params.get('page');
      this.lang = params.get('lang');
      this.moduleName = params.get('moduleName');


      if (this.token) {
        this.translateService.use(this.lang!);
        sessionStorage.setItem("Lang", this.lang!);
        sessionStorage.setItem("hiddenHeader", "hidden");
        sessionStorage.setItem("userToken", this.token!);
        sessionStorage.setItem("currentUser", JSON.stringify(jwt_decode(this.token!)));
        console.log("param");
        console.log(sessionStorage.getItem("userToken"));
        this.navigateToModule(this.pageName, this.moduleName);
      } else {
        this.hiddenHeader = sessionStorage.getItem("hiddenHeader")!;
      }
    });

    this.privateMessageInbox();

    if (this.router.url === '') {
      this.router.navigate(['/dashboard/classic']);
    }
    this.defaultSidebar = this.options.sidebartype;
    this.handleSidebar();
  }

  navigateToModule(page: string | null, moduleName: string | null): void {
    if (moduleName) {
      this.router.navigate(['/' + moduleName + '/' + page]);
    }
    else if (page) {
      this.router.navigate(['/component/' + page]);
    } else {
      // Default navigation or handle unknown page
      console.log('No page specified. Defaulting to /dashboard/classic.');
      this.router.navigate(['/dashboard/classic']);
    }
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: string) {
    this.handleSidebar();
  }

  handleSidebar() {
    this.innerWidth = window.innerWidth;
    switch (this.defaultSidebar) {
      case 'full':
      case 'iconbar':
        if (this.innerWidth < 1170) {
          this.options.sidebartype = 'mini-sidebar';
        } else {
          this.options.sidebartype = this.defaultSidebar;
        }
        break;

      case 'overlay':
        if (this.innerWidth < 767) {
          this.options.sidebartype = 'mini-sidebar';
        } else {
          this.options.sidebartype = this.defaultSidebar;
        }
        break;

      default:
    }
  }

  toggleSidebarType() {
    switch (this.options.sidebartype) {
      case 'full':
      case 'iconbar':
        this.options.sidebartype = 'mini-sidebar';
        break;

      case 'overlay':
        this.showMobileMenu = !this.showMobileMenu;
        break;

      case 'mini-sidebar':
        if (this.defaultSidebar === 'mini-sidebar') {
          this.options.sidebartype = 'full';
        } else {
          this.options.sidebartype = this.defaultSidebar;
        }
        break;

      default:
    }
  }

  privateMessageInbox() {
    this.privateService.privateMessageBySize().subscribe(result => {
      this.messageModel = result.content.map(e => new MyMessageModel(e, this.translateService));
    })
  }
  onHide() {
    this.showSettings = false
  }
  showSettingbar(target: number) {
    console.log("showSetting", target)
    this.active = target;
    this.showSettings = true;
  }

  handleClick(event: boolean) {
    this.showMobileMenu = event;
  }

  openUrlApp() {
    window.location.href = 'zeeme://zeeserver.myhr.co.th/openapp';
  }

}

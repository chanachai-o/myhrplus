import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmpviewComponent } from './empview.component';
import { NgbdpregressbarBasicComponent } from './progressbar/progressbar.component';
import { NgbdpaginationBasicComponent } from './pagination/pagination.component';
import { NgbdAlertBasicComponent } from './alert/alert.component';
import { NgbdCarouselBasicComponent } from './carousel/carousel.component';
import { NgbdDatepickerBasicComponent } from './datepicker/datepicker.component';
import { NgbdDropdownBasicComponent } from './dropdown-collapse/dropdown-collapse.component';
import { NgbdModalBasicComponent } from './modal/modal.component';
import { NgbdPopTooltipComponent } from './popover-tooltip/popover-tooltip.component';
import { NgbdratingBasicComponent } from './rating/rating.component';
import { NgbdtabsBasicComponent } from './tabs/tabs.component';
import { NgbdtimepickerBasicComponent } from './timepicker/timepicker.component';
import { NgbdtypeheadBasicComponent } from './typehead/typehead.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { CardsComponent } from './card/card.component';
import { ToastComponent } from './toast/toast.component';
import { NotifierComponent } from './notifier/notifier.component';
import { NgbdDatepickerLanguageComponent } from './language-datepicker/language-datepicker.component';
import { ChatComponent } from './chat/chat.component';

const routes: Routes = [
  {
    path: '',
    component: EmpviewComponent,
    children: [
      {
        path: 'chat-ai',
        component: ChatComponent,
      },
      {
        path: 'progressbar',
        component: NgbdpregressbarBasicComponent,
      },
      {
        path: 'card',
        component: CardsComponent,
      },
      {
        path: 'pagination',
        component: NgbdpaginationBasicComponent,
      },
      {
        path: 'alert',
        component: NgbdAlertBasicComponent,
      },
      {
        path: 'carousel',
        component: NgbdCarouselBasicComponent,
      },
      {
        path: 'datepicker',
        component: NgbdDatepickerBasicComponent,
      },
      {
        path: 'language-datepicker',
        component: NgbdDatepickerLanguageComponent,
      },
      {
        path: 'dropdown',
        component: NgbdDropdownBasicComponent,
      },
      {
        path: 'modal',
        component: NgbdModalBasicComponent,
      },
      {
        path: 'poptool',
        component: NgbdPopTooltipComponent,
      },
      {
        path: 'rating',
        component: NgbdratingBasicComponent,
      },
      {
        path: 'tabs',
        component: NgbdtabsBasicComponent,
      },
      {
        path: 'timepicker',
        component: NgbdtimepickerBasicComponent,
      },
      {
        path: 'typehead',
        component: NgbdtypeheadBasicComponent,
      },
      {
        path: 'buttons',
        component: ButtonsComponent,
      },
      {
        path: 'notifier',
        component: NotifierComponent,
      },
      {
        path: 'toast',
        component: ToastComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedUiRoutingModule { }

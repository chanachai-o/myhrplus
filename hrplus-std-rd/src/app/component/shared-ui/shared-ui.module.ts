import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiRoutingModule } from './shared-ui-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NotifierModule } from 'angular-notifier';
import { TranslateModule } from '@ngx-translate/core';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { DynamicIoModule } from 'ng-dynamic-component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { KtdGridModule } from '@katoid/angular-grid-layout';
import { SpeechToTextModule, TextAreaModule } from '@syncfusion/ej2-angular-inputs';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { ToastModule } from '@syncfusion/ej2-angular-notifications';

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
import { NgbdDatepickerLanguageComponent } from './language-datepicker/language-datepicker.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { CardsComponent } from './card/card.component';
import { NotifierComponent } from './notifier/notifier.component';
import { ToastComponent } from './toast/toast.component';
import { ToastsContainer } from './toast/toast-container';
import { ChatComponent } from './chat/chat.component';
import { ModalEmployeeComponent } from './modal-employee/modal-employee.component';
import { ModalEmployeeComponentPassComponent } from './modal-employee-component-pass/modal-employee-component-pass.component';
import { KerryEmployeeModalComponent } from './modal-mix/kerry/employee/employee.component';
import { CreateDocComponent } from './modal-mix/myhr/create-doc/create-doc.component';
import { WorkareaModalComponent } from './modal-mix/myhr/workarea/workarea.component';
import { BackpayTypeModalComponent } from './modal-mix/kerry/backpay-type/backpay-type.component';
import { DefinitionModalComponent } from './modal-mix/myhr/definition/definition.component';
import { Time0ModalComponent } from './modal-mix/kerry/time0/time0.component';
import { ReasonModalComponent } from './modal-mix/kerry/reason/reason.component';
import { CostCenterModalComponent } from './modal-mix/kerry/cost-center/cost-center.component';
import { ResignReasonModalComponent } from './modal-mix/kerry/resign-reason/resign-reason.component';
import { CreateMessageComponent } from './modal-mix/myhr/create-message/create-message.component';
import { BankComponent } from './modal-mix/kerry/bank/bank.component';
import { DatepickerI18nThaiComponent } from './datepicker-i18n-thai/datepicker-i18n-thai.component';
import { ReasonOtModalComponent } from './modal-mix/kerry/reason-ot/reason-ot.component';
import { ThaiDatePipe } from './thaidate.pipe';

@NgModule({
  imports: [
    CommonModule,
    SharedUiRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NotifierModule,
    TranslateModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    DynamicIoModule,
    FullCalendarModule,
    PdfViewerModule,
    KtdGridModule,
    SpeechToTextModule,
    TextAreaModule,
    DropDownListModule,
    SwitchModule,
    ToastModule,
    EmpviewComponent,
    NgbdpregressbarBasicComponent,
    NgbdpaginationBasicComponent,
    NgbdAlertBasicComponent,
    NgbdCarouselBasicComponent,
    NgbdDatepickerBasicComponent,
    NgbdDropdownBasicComponent,
    NgbdModalBasicComponent,
    NgbdPopTooltipComponent,
    NgbdratingBasicComponent,
    NgbdtabsBasicComponent,
    NgbdtimepickerBasicComponent,
    NgbdtypeheadBasicComponent,
    NgbdDatepickerLanguageComponent,
    ButtonsComponent,
    CardsComponent,
    NotifierComponent,
    ToastComponent,
    ToastsContainer,
    ChatComponent,
    ModalEmployeeComponent,
    ModalEmployeeComponentPassComponent,
    KerryEmployeeModalComponent,
    CreateDocComponent,
    WorkareaModalComponent,
    BackpayTypeModalComponent,
    DefinitionModalComponent,
    Time0ModalComponent,
    ReasonModalComponent,
    CostCenterModalComponent,
    ResignReasonModalComponent,
    CreateMessageComponent,
    BankComponent,
    DatepickerI18nThaiComponent,
    ReasonOtModalComponent,
    ThaiDatePipe
  ]
})
export class SharedUiModule { }

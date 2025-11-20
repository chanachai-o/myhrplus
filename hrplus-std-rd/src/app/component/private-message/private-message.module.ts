import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivateMessageRoutingModule } from './private-message-routing.module';

import { PrivateMessageInboxComponent } from './private-message-inbox/private-message-inbox.component';
import { PrivateMessageOutboxComponent } from './private-message-outbox/private-message-outbox.component';

@NgModule({
  imports: [
    CommonModule,
    PrivateMessageRoutingModule,
    PrivateMessageInboxComponent,
    PrivateMessageOutboxComponent
  ]
})
export class PrivateMessageModule { }

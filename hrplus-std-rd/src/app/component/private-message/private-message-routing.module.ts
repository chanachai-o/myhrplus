import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PrivateMessageInboxComponent } from './private-message-inbox/private-message-inbox.component';
import { PrivateMessageOutboxComponent } from './private-message-outbox/private-message-outbox.component';
import { AuthGuard } from 'src/app/auth.guard';

const routes: Routes = [
  {
    path: 'private-message-inbox',
    component: PrivateMessageInboxComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Inbox',
      urls: [
        { title: 'Private Message', url: '/dashboard' },
        { title: 'Inbox' }
      ]
    }
  },
  {
    path: 'private-message-inbox/:messageid',
    component: PrivateMessageInboxComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Inbox',
      urls: [
        { title: 'Private Message', url: '/dashboard' },
        { title: 'Inbox' }
      ]
    }
  },
  {
    path: 'private-message-outbox',
    component: PrivateMessageOutboxComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Sentbox',
      urls: [
        { title: 'Private Message', url: '/dashboard' },
        { title: 'Sentbox' }
      ]
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateMessageRoutingModule { }

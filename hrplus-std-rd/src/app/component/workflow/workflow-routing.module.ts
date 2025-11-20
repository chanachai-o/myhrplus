import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyhrCenterBoxComponent } from './myhr-center-box/myhr-center-box/myhr-center-box.component';
import { MyhrCreateWfComponent } from './myhr-create-wf/myhr-create-wf/myhr-create-wf.component';
import { MyhrDeleteDocComponent } from './myhr-delete-doc/myhr-delete-doc/myhr-delete-doc.component';
import { MyhrInBoxComponent } from './myhr-in-box/myhr-in-box/myhr-in-box.component';
import { MyhrManageDocComponent } from './myhr-manage-doc/myhr-manage-doc/myhr-manage-doc.component';
import { MyhrMoveDocComponent } from './myhr-move-doc/myhr-move-doc/myhr-move-doc.component';
import { MyhrOutBoxComponent } from './myhr-out-box/myhr-out-box/myhr-out-box.component';
import { AuthGuard } from 'src/app/auth.guard';
import { WorkflowTypeComponent } from './workflow-type/workflow-type.component';

const routes: Routes = [
  {
    path: 'myhr-center-box',
    component: MyhrCenterBoxComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Sharebox',
      urls: [
        { title: 'menu.empview-workflow', url: '/dashboard' },
        { title: 'Sharebox' }
      ]
    }
  },
  {
    path: 'myhr-create-wf',
    component: MyhrCreateWfComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Create Workflow',
      urls: [
        { title: 'menu.empview-workflow', url: '/dashboard' },
        { title: 'Create Workflow' }
      ]
    }
  },
  {
    path: 'myhr-delete-doc',
    component: MyhrDeleteDocComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'myhr-delete-doc',
      urls: [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'myhr-delete-doc' }
      ]
    }
  },
  {
    path: 'myhr-in-box',
    component: MyhrInBoxComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Inbox',
      urls: [
        { title: 'menu.empview-workflow', url: '/dashboard' },
        { title: 'Inbox' }
      ]
    }
  },
  {
    path: 'myhr-manage-doc',
    component: MyhrManageDocComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'myhr-manage-doc',
      urls: [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'myhr-manage-doc' }
      ]
    }
  },
  {
    path: 'myhr-move-doc',
    component: MyhrMoveDocComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'myhr-move-doc',
      urls: [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'myhr-move-doc' }
      ]
    }
  },
  {
    path: 'myhr-out-box',
    component: MyhrOutBoxComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Sentbox',
      urls: [
        { title: 'menu.empview-workflow', url: '/dashboard' },
        { title: 'Sentbox' }
      ]
    }
  },
  {
    path: 'workflow-type/:wfid',
    component: WorkflowTypeComponent,
    canActivate: [AuthGuard],
    // data: {
    //   title: 'Sentbox',
    //   urls: [
    //     { title: 'menu.empview-workflow', url: '/dashboard' },
    //     { title: 'Sentbox' }
    //   ]
    // }
  },
  {
    path: 'workflow-type/:wfid/:runno',
    component: WorkflowTypeComponent,
    canActivate: [AuthGuard],
    // data: {
    //   title: 'Sentbox',
    //   urls: [
    //     { title: 'menu.empview-workflow', url: '/dashboard' },
    //     { title: 'Sentbox' }
    //   ]
    // }
  },
  {
    path: 'workflow-type/:wfid/:runno/:traningId',
    component: WorkflowTypeComponent,
    canActivate: [AuthGuard],
    // data: {
    //   title: 'Sentbox',
    //   urls: [
    //     { title: 'menu.empview-workflow', url: '/dashboard' },
    //     { title: 'Sentbox' }
    //   ]
    // }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkflowRoutingModule { }

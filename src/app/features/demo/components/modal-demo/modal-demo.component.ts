import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { GlassCardComponent } from '../../../../shared/components/glass-card/glass-card.component';
import { GlassButtonComponent } from '../../../../shared/components/glass-button/glass-button.component';
import { CodeViewerComponent } from '../../shared/code-viewer/code-viewer.component';
import { PropsTableComponent, PropDefinition } from '../../shared/props-table/props-table.component';

@Component({
  selector: 'app-modal-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, GlassCardComponent, GlassButtonComponent, CodeViewerComponent, PropsTableComponent],
  templateUrl: './modal-demo.component.html',
  styleUrls: ['./modal-demo.component.scss']
})
export class ModalDemoComponent {
  showBasicModal: boolean = false;
  showLargeModal: boolean = false;
  showNoFooterModal: boolean = false;
  showDangerModal: boolean = false;
  selectedSize: 'sm' | 'md' | 'lg' | 'xl' = 'md';

  props: PropDefinition[] = [
    {
      name: 'show',
      type: 'boolean',
      default: 'false',
      description: 'Control modal visibility',
      required: true
    },
    {
      name: 'title',
      type: 'string',
      default: "''",
      description: 'Modal title',
      required: false
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg' | 'xl'",
      default: "'md'",
      description: 'Modal size',
      required: false
    },
    {
      name: 'closable',
      type: 'boolean',
      default: 'true',
      description: 'Show close button',
      required: false
    },
    {
      name: 'showFooter',
      type: 'boolean',
      default: 'true',
      description: 'Show footer with buttons',
      required: false
    },
    {
      name: 'showCancel',
      type: 'boolean',
      default: 'true',
      description: 'Show cancel button',
      required: false
    },
    {
      name: 'showConfirm',
      type: 'boolean',
      default: 'true',
      description: 'Show confirm button',
      required: false
    },
    {
      name: 'cancelText',
      type: 'string',
      default: "'ยกเลิก'",
      description: 'Cancel button text',
      required: false
    },
    {
      name: 'confirmText',
      type: 'string',
      default: "'ยืนยัน'",
      description: 'Confirm button text',
      required: false
    },
    {
      name: 'confirmVariant',
      type: "'primary' | 'danger'",
      default: "'primary'",
      description: 'Confirm button variant',
      required: false
    },
    {
      name: 'closeOnBackdrop',
      type: 'boolean',
      default: 'true',
      description: 'Close modal when clicking backdrop',
      required: false
    }
  ];

  outputs: PropDefinition[] = [
    {
      name: 'closeEvent',
      type: 'EventEmitter<void>',
      default: '-',
      description: 'Emitted when modal is closed',
      required: false
    },
    {
      name: 'confirmEvent',
      type: 'EventEmitter<void>',
      default: '-',
      description: 'Emitted when confirm button is clicked',
      required: false
    },
    {
      name: 'cancelEvent',
      type: 'EventEmitter<void>',
      default: '-',
      description: 'Emitted when cancel button is clicked',
      required: false
    }
  ];

  basicExample = `<app-modal
  [show]="showModal"
  title="Basic Modal"
  (closeEvent)="showModal = false">
  <p>Modal content goes here</p>
</app-modal>`;

  sizesExample = `<app-modal
  [show]="showModal"
  title="Small Modal"
  size="sm">
  Small modal content
</app-modal>

<app-modal
  [show]="showModal"
  title="Large Modal"
  size="lg">
  Large modal content
</app-modal>`;

  noFooterExample = `<app-modal
  [show]="showModal"
  title="Modal Without Footer"
  [showFooter]="false">
  Content without footer buttons
</app-modal>`;

  eventsExample = `<app-modal
  [show]="showModal"
  title="Modal with Events"
  (closeEvent)="onClose()"
  (confirmEvent)="onConfirm()"
  (cancelEvent)="onCancel()">
  Modal content
</app-modal>`;

  onConfirm(): void {
    alert('Confirmed!');
    this.showBasicModal = false;
  }

  onDangerConfirm(): void {
    alert('Danger action confirmed!');
    this.showDangerModal = false;
  }
}

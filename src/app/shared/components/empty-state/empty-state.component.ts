import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss']
})
export class EmptyStateComponent {
  @Input() icon: string = 'inbox';
  @Input() title: string = 'ไม่มีข้อมูล';
  @Input() description: string = 'ยังไม่มีรายการในระบบ';
  @Input() showAction: boolean = false;
  @Input() actionText: string = 'เพิ่มรายการ';
  @Input() actionIcon: string = 'add';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() variant: 'default' | 'minimal' = 'default';

  @Output() actionClick = new EventEmitter<void>();

  onActionClick(): void {
    this.actionClick.emit();
  }
}



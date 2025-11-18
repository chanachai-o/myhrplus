import { Component, Input } from '@angular/core';

export type StatusType = 
  | 'pending' | 'approved' | 'rejected' | 'cancelled'
  | 'draft' | 'submitted' | 'reviewed' | 'completed'
  | 'active' | 'inactive' | 'suspended'
  | 'registered' | 'ongoing' | 'finished'
  | 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.scss']
})
export class StatusBadgeComponent {
  @Input() status: StatusType = 'pending';
  @Input() label: string = '';
  @Input() showIcon: boolean = true;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() variant: 'filled' | 'outlined' | 'soft' = 'filled';

  get displayLabel(): string {
    if (this.label) return this.label;
    
    const labelMap: Record<StatusType, string> = {
      pending: 'รอดำเนินการ',
      approved: 'อนุมัติแล้ว',
      rejected: 'ปฏิเสธ',
      cancelled: 'ยกเลิก',
      draft: 'ร่าง',
      submitted: 'ส่งแล้ว',
      reviewed: 'ตรวจสอบแล้ว',
      completed: 'เสร็จสมบูรณ์',
      active: 'ใช้งาน',
      inactive: 'ไม่ใช้งาน',
      suspended: 'ระงับ',
      registered: 'ลงทะเบียนแล้ว',
      ongoing: 'กำลังดำเนินการ',
      finished: 'เสร็จสิ้น',
      success: 'สำเร็จ',
      error: 'ข้อผิดพลาด',
      warning: 'คำเตือน',
      info: 'ข้อมูล'
    };
    return labelMap[this.status] || this.status;
  }

  get statusIcon(): string {
    const iconMap: Record<StatusType, string> = {
      pending: 'schedule',
      approved: 'check_circle',
      rejected: 'cancel',
      cancelled: 'block',
      draft: 'edit',
      submitted: 'send',
      reviewed: 'visibility',
      completed: 'done_all',
      active: 'check_circle',
      inactive: 'remove_circle',
      suspended: 'pause_circle',
      registered: 'how_to_reg',
      ongoing: 'sync',
      finished: 'flag',
      success: 'check_circle',
      error: 'error',
      warning: 'warning',
      info: 'info'
    };
    return iconMap[this.status] || 'circle';
  }

  get statusColor(): string {
    const colorMap: Record<StatusType, string> = {
      pending: 'amber',
      approved: 'green',
      rejected: 'red',
      cancelled: 'gray',
      draft: 'blue',
      submitted: 'indigo',
      reviewed: 'purple',
      completed: 'green',
      active: 'green',
      inactive: 'gray',
      suspended: 'orange',
      registered: 'blue',
      ongoing: 'blue',
      finished: 'green',
      success: 'green',
      error: 'red',
      warning: 'amber',
      info: 'blue'
    };
    return colorMap[this.status] || 'gray';
  }
}



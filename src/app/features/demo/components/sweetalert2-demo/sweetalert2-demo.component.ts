import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { GlassCardComponent } from '../../../../shared/components/glass-card/glass-card.component';
import { CodeViewerComponent } from '../../shared/code-viewer/code-viewer.component';

@Component({
  selector: 'app-sweetalert2-demo',
  standalone: true,
  imports: [CommonModule, GlassCardComponent, CodeViewerComponent],
  templateUrl: './sweetalert2-demo.component.html',
  styleUrls: ['./sweetalert2-demo.component.scss']
})
export class SweetAlert2DemoComponent {
  basicExample = `import Swal from 'sweetalert2';

Swal.fire('สำเร็จ!', 'บันทึกข้อมูลเรียบร้อยแล้ว', 'success');`;

  confirmExample = `Swal.fire({
  title: 'ยืนยันการลบ',
  text: 'คุณแน่ใจหรือไม่?',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonText: 'ลบ',
  cancelButtonText: 'ยกเลิก'
}).then((result) => {
  if (result.isConfirmed) {
    // Handle delete
  }
});`;

  showSuccess(): void {
    Swal.fire({
      title: 'สำเร็จ!',
      text: 'บันทึกข้อมูลเรียบร้อยแล้ว',
      icon: 'success',
      confirmButtonText: 'ตกลง'
    });
  }

  showError(): void {
    Swal.fire({
      title: 'เกิดข้อผิดพลาด!',
      text: 'ไม่สามารถบันทึกข้อมูลได้',
      icon: 'error',
      confirmButtonText: 'ตกลง'
    });
  }

  showWarning(): void {
    Swal.fire({
      title: 'คำเตือน!',
      text: 'กรุณาตรวจสอบข้อมูลอีกครั้ง',
      icon: 'warning',
      confirmButtonText: 'ตกลง'
    });
  }

  showInfo(): void {
    Swal.fire({
      title: 'ข้อมูล',
      text: 'นี่คือข้อความแจ้งเตือน',
      icon: 'info',
      confirmButtonText: 'ตกลง'
    });
  }

  showQuestion(): void {
    Swal.fire({
      title: 'คำถาม',
      text: 'คุณต้องการดำเนินการต่อหรือไม่?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ใช่',
      cancelButtonText: 'ไม่'
    });
  }

  showConfirm(): void {
    Swal.fire({
      title: 'ยืนยันการลบ',
      text: 'คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('ลบสำเร็จ!', 'ข้อมูลถูกลบแล้ว', 'success');
      }
    });
  }

  showCustom(): void {
    Swal.fire({
      title: 'Custom Alert',
      html: '<p>นี่คือ <strong>HTML</strong> content</p>',
      icon: 'info',
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: '<i class="ri-check-line"></i> ตกลง',
      cancelButtonText: '<i class="ri-close-line"></i> ยกเลิก',
      confirmButtonAriaLabel: 'ตกลง',
      cancelButtonAriaLabel: 'ยกเลิก'
    });
  }

  showTimer(): void {
    Swal.fire({
      title: 'Auto close alert',
      text: 'Alert นี้จะปิดอัตโนมัติใน 3 วินาที',
      icon: 'info',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false
    });
  }
}








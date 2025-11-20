import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RichTextEditorComponent } from '../../../../shared/components/rich-text-editor/rich-text-editor.component';
import { GlassCardComponent } from '../../../../shared/components/glass-card/glass-card.component';

@Component({
  selector: 'app-rich-text-editor-demo',
  standalone: true,
  imports: [CommonModule, RichTextEditorComponent, GlassCardComponent],
  templateUrl: './rich-text-editor-demo.component.html',
  styleUrls: ['./rich-text-editor-demo.component.scss']
})
export class RichTextEditorDemoComponent {
  // Basic editor value
  basicValue: string = '<p>นี่คือตัวอย่าง Rich Text Editor</p>';

  // Full featured editor value
  fullValue: string = `
    <h2>ยินดีต้อนรับสู่ Rich Text Editor</h2>
    <p>นี่คือตัวอย่างการใช้งาน Rich Text Editor แบบเต็มรูปแบบ</p>
    <ul>
      <li>รองรับการจัดรูปแบบข้อความ</li>
      <li>รองรับการแทรกรูปภาพ</li>
      <li>รองรับการสร้างตาราง</li>
      <li>รองรับการสร้างลิงก์</li>
    </ul>
    <p><strong>ข้อความตัวหนา</strong> และ <em>ข้อความตัวเอียง</em></p>
  `;

  // Minimal toolbar
  minimalToolbar = {
    items: [
      'Bold', 'Italic', 'Underline', '|',
      'FontName', 'FontSize', 'FontColor', '|',
      'Formats', 'Alignments', '|',
      'OrderedList', 'UnorderedList', '|',
      'CreateLink', 'Image', '|',
      'SourceCode', 'FullScreen'
    ]
  };

  // Full toolbar
  fullToolbar = {
    items: [
      'Bold', 'Italic', 'Underline', 'StrikeThrough',
      'FontName', 'FontSize', 'FontColor', 'BackgroundColor',
      'LowerCase', 'UpperCase', '|',
      'Formats', 'Alignments', 'OrderedList', 'UnorderedList',
      'Outdent', 'Indent', '|',
      'CreateLink', 'Image', 'Table', '|',
      'ClearFormat', 'Print',
      'SourceCode', 'FullScreen', '|',
      'Undo', 'Redo'
    ]
  };

  // Event handlers
  onValueChange(event: any): void {
    console.log('Value changed:', event.value);
  }

  onCreated(event: any): void {
    console.log('Editor created:', event);
  }

  onFocus(event: any): void {
    console.log('Editor focused:', event);
  }

  onBlur(event: any): void {
    console.log('Editor blurred:', event);
  }
}


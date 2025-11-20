import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartTextAreaComponent } from '../../../../shared/components/smart-textarea/smart-textarea.component';
import { GlassCardComponent } from '../../../../shared/components/glass-card/glass-card.component';
import { CodeViewerComponent } from '../../shared/code-viewer/code-viewer.component';

@Component({
  selector: 'app-smart-textarea-demo',
  standalone: true,
  imports: [CommonModule, SmartTextAreaComponent, GlassCardComponent, CodeViewerComponent],
  templateUrl: './smart-textarea-demo.component.html',
  styleUrls: ['./smart-textarea-demo.component.scss']
})
export class SmartTextAreaDemoComponent {
  @ViewChild('smartTextarea') smartTextarea!: SmartTextAreaComponent;

  // Settings
  placeholder: string = 'Type your message here...';
  floatLabelType: 'Auto' | 'Always' | 'Never' = 'Auto';
  rows: number = 5;
  cols: number = 50;
  value: string = '';
  enabled: boolean = true;
  readonly: boolean = false;
  resizeMode: 'None' | 'Both' | 'Horizontal' | 'Vertical' = 'Both';
  
  // AI Features
  userRole: string = 'Employee communicating with internal team';
  userPhrases: string[] = [
    'Thank you for your interest',
    'Please let us know if you have any questions'
  ];
  enableAI: boolean = false;

  // Methods
  getValue(): void {
    const value = this.smartTextarea?.getValue();
    if (value) {
      alert(`Value: ${value}`);
    } else {
      alert('No value');
    }
  }

  clear(): void {
    this.smartTextarea?.clear();
    this.value = '';
  }

  focusIn(): void {
    this.smartTextarea?.focusIn();
  }

  focusOut(): void {
    this.smartTextarea?.focusOut();
  }

  refresh(): void {
    this.smartTextarea?.refresh();
  }

  onChange(event: any): void {
    console.log('Value changed:', event);
    if (this.smartTextarea) {
      this.value = this.smartTextarea.getValue();
    }
  }

  onFocus(event: any): void {
    console.log('Focused:', event);
  }

  onBlur(event: any): void {
    console.log('Blurred:', event);
  }

  toggleFloatLabelType(type: 'Auto' | 'Always' | 'Never'): void {
    this.floatLabelType = type;
  }

  toggleResizeMode(mode: 'None' | 'Both' | 'Horizontal' | 'Vertical'): void {
    this.resizeMode = mode;
  }

  onRowsChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.rows = +target.value;
    }
  }

  onColsChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.cols = +target.value;
    }
  }

  // AI Suggestion Handler
  aiSuggestionHandler = (options: any): void => {
    console.log('AI Suggestion requested:', options);
    // This would typically call a server-side AI service
    // For demo purposes, we'll just log it
    if (options && options.text) {
      // Simulate AI suggestions
      const suggestions = [
        'Thank you for your message.',
        'I will get back to you soon.',
        'Please let me know if you need any assistance.'
      ];
      // In a real implementation, this would call an AI service
      console.log('AI Suggestions:', suggestions);
    }
  };

  // Code examples
  basicExample = `<app-smart-textarea
  [placeholder]="'Type your message...'"
  [floatLabelType]="'Auto'"
  [rows]="5"
  [value]="value"
  (change)="onChange($event)">
</app-smart-textarea>`;

  withAIExample = `<app-smart-textarea
  [placeholder]="'Type your message...'"
  [userRole]="'Employee'"
  [userPhrases]="['Thank you', 'Please let me know']"
  [aiSuggestionHandler]="aiSuggestionHandler"
  (change)="onChange($event)">
</app-smart-textarea>`;
}


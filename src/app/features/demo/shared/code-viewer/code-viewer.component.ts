import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-code-viewer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="code-viewer">
      <div class="code-header">
        <span class="code-title">{{ title }}</span>
        <button 
          class="copy-button"
          (click)="copyCode()"
          [attr.aria-label]="'Copy code'">
          {{ copied ? '✓ Copied' : 'Copy' }}
        </button>
      </div>
      <pre class="code-block"><code [innerHTML]="formattedCode"></code></pre>
    </div>
  `,
  styleUrls: ['./code-viewer.component.scss']
})
export class CodeViewerComponent {
  @Input() code: string = '';
  @Input() language: 'html' | 'typescript' | 'scss' = 'html';
  @Input() title: string = 'Code Example';
  
  copied: boolean = false;

  get formattedCode(): string {
    return this.escapeHtml(this.code);
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  copyCode(): void {
    navigator.clipboard.writeText(this.code).then(() => {
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 2000);
    });
  }
}



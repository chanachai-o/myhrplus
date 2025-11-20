import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignatureComponent } from '../../../../shared/components/signature/signature.component';
import { GlassCardComponent } from '../../../../shared/components/glass-card/glass-card.component';

@Component({
  selector: 'app-signature-demo',
  standalone: true,
  imports: [CommonModule, SignatureComponent, GlassCardComponent],
  templateUrl: './signature-demo.component.html',
  styleUrls: ['./signature-demo.component.scss']
})
export class SignatureDemoComponent {
  @ViewChild('signature') signature!: SignatureComponent;

  // Signature settings
  backgroundColor: string = '#ffffff';
  strokeColor: string = '#000000';
  minStrokeWidth: number = 0.5;
  maxStrokeWidth: number = 2.5;
  velocity: number = 0.7;
  isReadOnly: boolean = false;
  saveWithBackground: boolean = true;

  // Methods
  clear(): void {
    this.signature?.clear();
  }

  undo(): void {
    this.signature?.undo();
  }

  redo(): void {
    this.signature?.redo();
  }

  download(): void {
    this.signature?.download('signature');
  }

  saveAsBase64(): void {
    const base64 = this.signature?.saveAsBase64();
    if (base64) {
      console.log('Base64:', base64);
      // Copy to clipboard
      navigator.clipboard.writeText(base64).then(() => {
        alert('Base64 copied to clipboard!');
      });
    }
  }

  saveAsBlob(): void {
    const blob = this.signature?.saveAsBlob();
    if (blob) {
      console.log('Blob:', blob);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'signature.png';
      link.click();
      URL.revokeObjectURL(url);
    }
  }

  checkEmpty(): void {
    const isEmpty = this.signature?.isEmpty();
    alert(`Signature is ${isEmpty ? 'empty' : 'not empty'}`);
  }

  changeStrokeColor(color: string): void {
    this.strokeColor = color;
  }

  onStrokeColorChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.changeStrokeColor(target.value);
    }
  }

  changeBackgroundColor(color: string): void {
    this.backgroundColor = color;
  }

  onBackgroundColorChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.changeBackgroundColor(target.value);
    }
  }

  toggleReadOnly(): void {
    this.isReadOnly = !this.isReadOnly;
  }
}


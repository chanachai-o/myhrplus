import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml',
  standalone: true,
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    // Bypass Angular's security to trust the provided HTML.
    // Only use this for content that you know is safe to render!
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}

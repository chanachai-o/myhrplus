import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { GlassCardComponent } from '@shared/components/glass-card/glass-card.component';

@Component({
  selector: 'app-approve-budget',
  standalone: true,
  imports: [CommonModule, TranslateModule, PageHeaderComponent, GlassCardComponent],
  template: `
    <app-page-header [title]="'company.approveBudget.titleFull' | translate" [showBreadcrumbs]="true" icon="check_circle" iconGradient="from-primary to-primary" titleGradient="from-primary to-primary" customClass="border-b border-primary/30 dark:border-primary/50 pb-4"></app-page-header>
    <app-glass-card customClass="flex flex-col flex-1 p-6">
      <p class="text-gray-600 dark:text-gray-400">{{ 'company.approveBudget.placeholder' | translate }}</p>
    </app-glass-card>
  `,
  styles: [`:host { display: flex; flex-direction: column; height: 100%; gap: 1.5rem; }`]
})
export class ApproveBudgetComponent {}

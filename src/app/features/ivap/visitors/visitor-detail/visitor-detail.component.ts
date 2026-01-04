/**
 * Visitor Detail Component
 * Component สำหรับแสดงรายละเอียด Visitor
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { GlassCardComponent } from '@shared/components/glass-card/glass-card.component';
import { GlassButtonComponent } from '@shared/components/glass-button/glass-button.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { SharedModule } from '@shared/shared.module';
import { IvapVisitorService } from '@core/services';
import { Visitor } from '@core/models/ivap';
import { NotificationService } from '@core/services';

@Component({
  selector: 'app-visitor-detail',
  standalone: true,
  imports: [
    CommonModule,
    GlassCardComponent,
    GlassButtonComponent,
    PageHeaderComponent,
    IconComponent,
    SharedModule
  ],
  templateUrl: './visitor-detail.component.html',
  styleUrls: ['./visitor-detail.component.scss']
})
export class VisitorDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private visitorService = inject(IvapVisitorService);
  private notificationService = inject(NotificationService);

  visitor: Visitor | null = null;
  loading = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadVisitor(id);
    }
  }

  private loadVisitor(id: string): void {
    this.loading = true;
    this.visitorService.getById(id).subscribe({
      next: (visitor) => {
        this.visitor = visitor;
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.showError('Failed to load visitor details');
        this.loading = false;
      }
    });
  }

  onCheckIn(): void {
    if (!this.visitor) return;
    this.visitorService.checkIn(this.visitor.visitor_id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Visitor checked in successfully');
        this.loadVisitor(this.visitor!.visitor_id);
      },
      error: (error) => {
        this.notificationService.showError('Failed to check in visitor');
      }
    });
  }

  onCheckOut(): void {
    if (!this.visitor) return;
    this.visitorService.checkOut(this.visitor.visitor_id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Visitor checked out successfully');
        this.loadVisitor(this.visitor!.visitor_id);
      },
      error: (error) => {
        this.notificationService.showError('Failed to check out visitor');
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/ivap/visitors']);
  }
}


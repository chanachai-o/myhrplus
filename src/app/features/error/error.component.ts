import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IconComponent } from '@shared/components/icon/icon.component';
import { ROUTES } from '@core/constants/routes.constant';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, IconComponent],
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent {
  constructor(private router: Router) {}

  goHome(): void {
    this.router.navigate([ROUTES.IVAP.DASHBOARD]);
  }

  goBack(): void {
    window.history.back();
  }
}


import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IconComponent } from '@shared/components/icon/icon.component';
import { ROUTES } from '@core/constants/routes.constant';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    IconComponent
  ],
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.scss']
})
export class UnauthorizedComponent {
  private translate = inject(TranslateService);

  constructor(private router: Router) {}

  goHome(): void {
    this.router.navigate([ROUTES.IVAP.DASHBOARD]);
  }

  goBack(): void {
    window.history.back();
  }
}


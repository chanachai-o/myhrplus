import { Component } from '@angular/core';
import { NgbModule, NgbProgressbarConfig } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-ngbd-progressbar',
  templateUrl: './progressbar.component.html',
  providers: [NgbProgressbarConfig],
  standalone: true,
  imports: [NgbModule]
})
export class NgbdpregressbarBasicComponent {
  height = '20px';

  constructor(config: NgbProgressbarConfig) {
    // customize default values of progress bars used by this component tree
    config.max = 100;
    config.striped = true;
    config.animated = true;
    config.type = 'success';
  }
}

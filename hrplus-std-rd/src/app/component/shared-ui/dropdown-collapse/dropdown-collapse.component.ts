import { Component } from '@angular/core';
import { NgbDropdownModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dropdown-basic',
  templateUrl: './dropdown-collapse.component.html',
  standalone: true,
  imports: [CommonModule, NgbDropdownModule, NgbCollapseModule]
})
export class NgbdDropdownBasicComponent {
  // This is for the collapse example
  public isCollapsed = false;

  collapsed = true;
}

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PropDefinition {
  name: string;
  type: string;
  default?: string;
  description: string;
  required?: boolean;
}

@Component({
  selector: 'app-props-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="props-table-container">
      <h3 class="props-title">{{ title }}</h3>
      <div class="table-wrapper">
        <table class="props-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let prop of props">
              <td>
                <code class="prop-name">{{ prop.name }}</code>
                <span *ngIf="prop.required" class="required-badge">required</span>
              </td>
              <td><code class="prop-type">{{ prop.type }}</code></td>
              <td>
                <code *ngIf="prop.default" class="prop-default">{{ prop.default }}</code>
                <span *ngIf="!prop.default" class="text-muted">-</span>
              </td>
              <td class="prop-description">{{ prop.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styleUrls: ['./props-table.component.scss']
})
export class PropsTableComponent {
  @Input() props: PropDefinition[] = [];
  @Input() title: string = 'Properties';
}



import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { GlassCardComponent } from '../../../../shared/components/glass-card/glass-card.component';
import { CodeViewerComponent } from '../../shared/code-viewer/code-viewer.component';

interface City {
  id: number;
  name: string;
}

@Component({
  selector: 'app-ng-select-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule, GlassCardComponent, CodeViewerComponent],
  templateUrl: './ng-select-demo.component.html',
  styleUrls: ['./ng-select-demo.component.scss']
})
export class NgSelectDemoComponent {
  selectedCity: City | null = null;
  selectedCities: City[] = [];
  selectedCityId: number | null = null;
  
  cities: City[] = [
    { id: 1, name: 'กรุงเทพมหานคร' },
    { id: 2, name: 'เชียงใหม่' },
    { id: 3, name: 'ภูเก็ต' },
    { id: 4, name: 'พัทยา' },
    { id: 5, name: 'หัวหิน' },
    { id: 6, name: 'เกาะสมุย' },
    { id: 7, name: 'อุดรธานี' },
    { id: 8, name: 'ขอนแก่น' }
  ];

  basicExample = `<ng-select
  [(ngModel)]="selectedCity"
  [items]="cities"
  bindLabel="name"
  bindValue="id"
  placeholder="เลือกเมือง">
</ng-select>`;

  searchableExample = `<ng-select
  [(ngModel)]="selectedCity"
  [items]="cities"
  [searchable]="true"
  [clearable]="true"
  bindLabel="name"
  placeholder="ค้นหาและเลือกเมือง">
</ng-select>`;

  multiSelectExample = `<ng-select
  [(ngModel)]="selectedCities"
  [items]="cities"
  [multiple]="true"
  [closeOnSelect]="false"
  bindLabel="name"
  placeholder="เลือกหลายเมือง">
</ng-select>`;

  onCityChange(city: City | null): void {
    console.log('Selected city:', city);
  }

  getSelectedCityName(): string {
    if (!this.selectedCity) return 'None';
    // selectedCity is City | null, so we can access properties directly
    return this.selectedCity.name;
  }
}


import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpreadsheetComponent } from '../../../../shared/components/spreadsheet/spreadsheet.component';
import { GlassCardComponent } from '../../../../shared/components/glass-card/glass-card.component';

@Component({
  selector: 'app-spreadsheet-demo',
  standalone: true,
  imports: [CommonModule, SpreadsheetComponent, GlassCardComponent],
  templateUrl: './spreadsheet-demo.component.html',
  styleUrls: ['./spreadsheet-demo.component.scss']
})
export class SpreadsheetDemoComponent {
  @ViewChild('spreadsheet') spreadsheet!: SpreadsheetComponent;

  // Sample data
  sampleData: any[] = [
    { 'Item Name': 'Casual Shoes', 'Date': '02/14/2019', 'Time': '11:34:32 AM', 'Quantity': 10, 'Price': 20, 'Amount': 200, 'Discount': 1, 'Profit': 10 },
    { 'Item Name': 'Sports Shoes', 'Date': '06/11/2019', 'Time': '05:56:32 AM', 'Quantity': 20, 'Price': 30, 'Amount': 600, 'Discount': 5, 'Profit': 50 },
    { 'Item Name': 'Formal Shoes', 'Date': '07/27/2019', 'Time': '03:32:44 AM', 'Quantity': 20, 'Price': 15, 'Amount': 300, 'Discount': 7, 'Profit': 25 },
    { 'Item Name': 'Sandals & Floaters', 'Date': '11/21/2019', 'Time': '06:23:54 AM', 'Quantity': 15, 'Price': 20, 'Amount': 300, 'Discount': 11, 'Profit': 75 },
    { 'Item Name': 'Flip- Flops & Slippers', 'Date': '06/23/2019', 'Time': '12:43:59 AM', 'Quantity': 30, 'Price': 10, 'Amount': 300, 'Discount': 10, 'Profit': 70 },
    { 'Item Name': 'Sneakers', 'Date': '07/22/2019', 'Time': '10:55:53 AM', 'Quantity': 40, 'Price': 20, 'Amount': 800, 'Discount': 13, 'Profit': 90 },
    { 'Item Name': 'Running Shoes', 'Date': '02/04/2019', 'Time': '03:44:34 AM', 'Quantity': 20, 'Price': 10, 'Amount': 200, 'Discount': 3, 'Profit': 30 },
    { 'Item Name': 'Loafers', 'Date': '11/30/2019', 'Time': '03:12:52 AM', 'Quantity': 31, 'Price': 10, 'Amount': 310, 'Discount': 6, 'Profit': 41 },
    { 'Item Name': 'Cricket Shoes', 'Date': '07/09/2019', 'Time': '11:32:14 AM', 'Quantity': 41, 'Price': 30, 'Amount': 1230, 'Discount': 12, 'Profit': 110 },
    { 'Item Name': 'T-Shirts', 'Date': '10/31/2019', 'Time': '12:01:44 AM', 'Quantity': 50, 'Price': 10, 'Amount': 500, 'Discount': 9, 'Profit': 55 }
  ];

  sheets: any[] = [
    {
      name: 'Sales Data',
      ranges: [{ dataSource: this.sampleData }]
    }
  ];

  // Methods
  openFile(event: any): void {
    const file = event.target.files[0];
    if (file && this.spreadsheet) {
      this.spreadsheet.open(file);
    }
  }

  saveAsExcel(): void {
    this.spreadsheet?.saveAsExcel('SpreadsheetData');
  }

  saveAsCsv(): void {
    this.spreadsheet?.saveAsCsv('SpreadsheetData');
  }

  saveAsPdf(): void {
    this.spreadsheet?.saveAsPdf('SpreadsheetData');
  }

  insertRow(): void {
    this.spreadsheet?.insertRow(1);
  }

  insertColumn(): void {
    this.spreadsheet?.insertColumn(1);
  }

  deleteRow(): void {
    this.spreadsheet?.deleteRow(1);
  }

  deleteColumn(): void {
    this.spreadsheet?.deleteColumn(1);
  }

  undo(): void {
    this.spreadsheet?.undo();
  }

  redo(): void {
    this.spreadsheet?.redo();
  }

  cut(): void {
    this.spreadsheet?.cut();
  }

  copy(): void {
    this.spreadsheet?.copy();
  }

  paste(): void {
    this.spreadsheet?.paste();
  }

  goToCell(): void {
    this.spreadsheet?.goToCell('A1');
  }

  addSheet(): void {
    this.spreadsheet?.addSheet();
  }
}


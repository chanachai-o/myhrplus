/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ImportSummaryDataComponent } from './import-summary-data.component';

describe('ImportSummaryDataComponent', () => {
  let component: ImportSummaryDataComponent;
  let fixture: ComponentFixture<ImportSummaryDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [ImportSummaryDataComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportSummaryDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SummaryWorkHourReportStoreCenterComponent } from './summary-work-hour-report-store-center.component';

describe('SummaryWorkHourReportStoreCenterComponent', () => {
  let component: SummaryWorkHourReportStoreCenterComponent;
  let fixture: ComponentFixture<SummaryWorkHourReportStoreCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [SummaryWorkHourReportStoreCenterComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryWorkHourReportStoreCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

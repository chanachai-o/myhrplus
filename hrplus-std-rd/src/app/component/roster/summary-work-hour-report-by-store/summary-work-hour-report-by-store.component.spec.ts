import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryWorkHourReportByStoreComponent } from './summary-work-hour-report-by-store.component';

describe('SummaryWorkHourReportByStoreComponent', () => {
  let component: SummaryWorkHourReportByStoreComponent;
  let fixture: ComponentFixture<SummaryWorkHourReportByStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SummaryWorkHourReportByStoreComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryWorkHourReportByStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

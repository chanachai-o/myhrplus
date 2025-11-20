import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryDataComponent } from './summary-data.component';

describe('SummaryDataComponent', () => {
  let component: SummaryDataComponent;
  let fixture: ComponentFixture<SummaryDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SummaryDataComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

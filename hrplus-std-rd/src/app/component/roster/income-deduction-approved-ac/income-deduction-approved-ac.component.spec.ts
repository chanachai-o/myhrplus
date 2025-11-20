import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeDeductionApprovedAcComponent } from './income-deduction-approved-ac.component';

describe('IncomeDeductionApprovedAcComponent', () => {
  let component: IncomeDeductionApprovedAcComponent;
  let fixture: ComponentFixture<IncomeDeductionApprovedAcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [IncomeDeductionApprovedAcComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeDeductionApprovedAcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

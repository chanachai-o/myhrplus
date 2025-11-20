import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeDeductionApprovedRgmComponent } from './income-deduction-approved-rgm.component';

describe('IncomeDeductionApprovedRgmComponent', () => {
  let component: IncomeDeductionApprovedRgmComponent;
  let fixture: ComponentFixture<IncomeDeductionApprovedRgmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [IncomeDeductionApprovedRgmComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeDeductionApprovedRgmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

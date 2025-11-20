import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TAUCSCWF008HrComponent } from './tau-cscwf008-hr.component';

describe('TAUCSCWF008HrComponent', () => {
  let component: TAUCSCWF008HrComponent;
  let fixture: ComponentFixture<TAUCSCWF008HrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TAUCSCWF008HrComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TAUCSCWF008HrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

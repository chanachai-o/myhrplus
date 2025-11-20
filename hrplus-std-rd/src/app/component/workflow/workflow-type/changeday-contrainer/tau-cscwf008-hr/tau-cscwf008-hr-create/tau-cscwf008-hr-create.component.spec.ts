import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TAUCSCWF008HrCreateComponent } from './tau-cscwf008-hr-create.component';

describe('TAUCSCWF008HrCreateComponent', () => {
  let component: TAUCSCWF008HrCreateComponent;
  let fixture: ComponentFixture<TAUCSCWF008HrCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TAUCSCWF008HrCreateComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TAUCSCWF008HrCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

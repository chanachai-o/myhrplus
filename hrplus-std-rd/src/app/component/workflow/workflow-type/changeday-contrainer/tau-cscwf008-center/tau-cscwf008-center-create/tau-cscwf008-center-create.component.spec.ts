import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TAUCSCWF008CenterCreateComponent } from './tau-cscwf008-center-create.component';

describe('TAUCSCWF008CenterCreateComponent', () => {
  let component: TAUCSCWF008CenterCreateComponent;
  let fixture: ComponentFixture<TAUCSCWF008CenterCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TAUCSCWF008CenterCreateComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TAUCSCWF008CenterCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

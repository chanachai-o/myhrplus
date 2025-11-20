import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TAUCSCWF008CenterComponent } from './tau-cscwf008-center.component';

describe('TAUCSCWF008CenterComponent', () => {
  let component: TAUCSCWF008CenterComponent;
  let fixture: ComponentFixture<TAUCSCWF008CenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TAUCSCWF008CenterComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TAUCSCWF008CenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

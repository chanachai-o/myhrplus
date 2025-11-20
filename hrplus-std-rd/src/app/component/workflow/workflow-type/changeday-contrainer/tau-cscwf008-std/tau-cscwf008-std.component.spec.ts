import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TAUCSCWF008STDComponent } from './tau-cscwf008-std.component';

describe('TAUCSCWF008STDComponent', () => {
  let component: TAUCSCWF008STDComponent;
  let fixture: ComponentFixture<TAUCSCWF008STDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TAUCSCWF008STDComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TAUCSCWF008STDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TAUCSCWF006DetailComponent } from './tau-cscwf006-detail.component';

describe('TAUCSCWF006DetailComponent', () => {
  let component: TAUCSCWF006DetailComponent;
  let fixture: ComponentFixture<TAUCSCWF006DetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TAUCSCWF006DetailComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TAUCSCWF006DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

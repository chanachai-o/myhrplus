import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TAUCSCWF123Component } from './tau-cscwf123.component';

describe('TAUCSCWF123Component', () => {
  let component: TAUCSCWF123Component;
  let fixture: ComponentFixture<TAUCSCWF123Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TAUCSCWF123Component]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TAUCSCWF123Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

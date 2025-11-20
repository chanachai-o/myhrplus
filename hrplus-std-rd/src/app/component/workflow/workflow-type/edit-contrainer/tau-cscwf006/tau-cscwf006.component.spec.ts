import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TAUCSCWF006Component } from './tau-cscwf006.component';

describe('TAUCSCWF006Component', () => {
  let component: TAUCSCWF006Component;
  let fixture: ComponentFixture<TAUCSCWF006Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TAUCSCWF006Component]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TAUCSCWF006Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

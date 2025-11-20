import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TAUCSCWF122Component } from './tau-cscwf122.component';

describe('TAUCSCWF122Component', () => {
  let component: TAUCSCWF122Component;
  let fixture: ComponentFixture<TAUCSCWF122Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TAUCSCWF122Component]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TAUCSCWF122Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

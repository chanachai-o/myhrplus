import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TAUCSCWF005Component } from './tau-cscwf005.component';

describe('TAUCSCWF005Component', () => {
  let component: TAUCSCWF005Component;
  let fixture: ComponentFixture<TAUCSCWF005Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TAUCSCWF005Component]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TAUCSCWF005Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

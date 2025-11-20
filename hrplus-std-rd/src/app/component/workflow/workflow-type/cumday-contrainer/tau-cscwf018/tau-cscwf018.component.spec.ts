import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TAUCSCWF018Component } from './tau-cscwf018.component';

describe('TAUCSCWF018Component', () => {
  let component: TAUCSCWF018Component;
  let fixture: ComponentFixture<TAUCSCWF018Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TAUCSCWF018Component]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TAUCSCWF018Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

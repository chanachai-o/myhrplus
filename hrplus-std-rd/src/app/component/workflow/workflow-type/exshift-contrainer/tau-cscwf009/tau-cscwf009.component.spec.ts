import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TauCscwf009Component } from './tau-cscwf009.component';

describe('TauCscwf009Component', () => {
  let component: TauCscwf009Component;
  let fixture: ComponentFixture<TauCscwf009Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TauCscwf009Component]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TauCscwf009Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

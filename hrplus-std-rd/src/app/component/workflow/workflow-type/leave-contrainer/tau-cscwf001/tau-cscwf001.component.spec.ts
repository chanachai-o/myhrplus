import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TauCscwf001Component } from './tau-cscwf001.component';

describe('TauCscwf001Component', () => {
  let component: TauCscwf001Component;
  let fixture: ComponentFixture<TauCscwf001Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TauCscwf001Component]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TauCscwf001Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Trawf004Component } from './trawf004.component';

describe('Trawf004Component', () => {
  let component: Trawf004Component;
  let fixture: ComponentFixture<Trawf004Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Trawf004Component]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Trawf004Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

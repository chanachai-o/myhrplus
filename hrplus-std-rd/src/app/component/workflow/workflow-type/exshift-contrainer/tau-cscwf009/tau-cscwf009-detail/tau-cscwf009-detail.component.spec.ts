import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TauCscwf009DetailComponent } from './tau-cscwf009-detail.component';

describe('TauCscwf009DetailComponent', () => {
  let component: TauCscwf009DetailComponent;
  let fixture: ComponentFixture<TauCscwf009DetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TauCscwf009DetailComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TauCscwf009DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

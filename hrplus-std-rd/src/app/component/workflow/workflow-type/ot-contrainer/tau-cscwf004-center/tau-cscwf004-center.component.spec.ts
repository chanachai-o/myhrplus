import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TAUCSCWF004CenterComponent } from './tau-cscwf004-center.component';

describe('TAUCSCWF004CenterComponent', () => {
  let component: TAUCSCWF004CenterComponent;
  let fixture: ComponentFixture<TAUCSCWF004CenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TAUCSCWF004CenterComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TAUCSCWF004CenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TAUCSCWF004CenterCreateComponent } from './tau-cscwf004-center-create.component';

describe('TAUCSCWF004CenterCreateComponent', () => {
  let component: TAUCSCWF004CenterCreateComponent;
  let fixture: ComponentFixture<TAUCSCWF004CenterCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TAUCSCWF004CenterCreateComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TAUCSCWF004CenterCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

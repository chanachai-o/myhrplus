import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TAUCSCWF001HRComponent } from './tau-cscwf001-hr.component';

describe('TAUCSCWF001HRComponent', () => {
  let component: TAUCSCWF001HRComponent;
  let fixture: ComponentFixture<TAUCSCWF001HRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TAUCSCWF001HRComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TAUCSCWF001HRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

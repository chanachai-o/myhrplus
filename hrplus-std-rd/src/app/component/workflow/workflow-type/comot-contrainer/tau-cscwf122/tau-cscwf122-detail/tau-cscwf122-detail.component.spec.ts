import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TAUCSCWF122DetailComponent } from './tau-cscwf122-detail.component';

describe('TAUCSCWF122DetailComponent', () => {
  let component: TAUCSCWF122DetailComponent;
  let fixture: ComponentFixture<TAUCSCWF122DetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TAUCSCWF122DetailComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TAUCSCWF122DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

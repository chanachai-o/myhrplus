import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TAUCSCWF123DetailComponent } from './tau-cscwf123-detail.component';

describe('TAUCSCWF123DetailComponent', () => {
  let component: TAUCSCWF123DetailComponent;
  let fixture: ComponentFixture<TAUCSCWF123DetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TAUCSCWF123DetailComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TAUCSCWF123DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

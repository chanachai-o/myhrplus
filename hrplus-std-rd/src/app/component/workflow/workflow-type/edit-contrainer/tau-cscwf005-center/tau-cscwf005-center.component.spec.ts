import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TAUCSCWF005CenterComponent } from './tau-cscwf005-center.component';

describe('TAUCSCWF005CenterComponent', () => {
  let component: TAUCSCWF005CenterComponent;
  let fixture: ComponentFixture<TAUCSCWF005CenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TAUCSCWF005CenterComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TAUCSCWF005CenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

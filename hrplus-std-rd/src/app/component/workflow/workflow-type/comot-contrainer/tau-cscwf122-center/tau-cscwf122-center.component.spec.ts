import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TAUCSCWF122CenterComponent } from './tau-cscwf122-center.component';

describe('TAUCSCWF122CenterComponent', () => {
  let component: TAUCSCWF122CenterComponent;
  let fixture: ComponentFixture<TAUCSCWF122CenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TAUCSCWF122CenterComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TAUCSCWF122CenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

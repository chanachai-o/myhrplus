import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TAUCSCWF122CenterDetailComponent } from './tau-cscwf122-center-detail.component';

describe('TAUCSCWF122CenterDetailComponent', () => {
  let component: TAUCSCWF122CenterDetailComponent;
  let fixture: ComponentFixture<TAUCSCWF122CenterDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TAUCSCWF122CenterDetailComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TAUCSCWF122CenterDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

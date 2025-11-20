import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TAUCSCWF018SupDetailComponent } from './tau-cscwf018-sup-detail.component';

describe('TAUCSCWF018SupDetailComponent', () => {
  let component: TAUCSCWF018SupDetailComponent;
  let fixture: ComponentFixture<TAUCSCWF018SupDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TAUCSCWF018SupDetailComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TAUCSCWF018SupDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

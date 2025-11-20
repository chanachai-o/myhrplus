import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TauCscwf009SupDetailComponent } from './tau-cscwf009-sup-detail.component';

describe('TauCscwf009SupDetailComponent', () => {
  let component: TauCscwf009SupDetailComponent;
  let fixture: ComponentFixture<TauCscwf009SupDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TauCscwf009SupDetailComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TauCscwf009SupDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

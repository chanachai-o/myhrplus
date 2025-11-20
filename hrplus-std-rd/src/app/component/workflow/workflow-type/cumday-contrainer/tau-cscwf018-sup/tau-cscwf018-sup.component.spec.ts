import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TAUCSCWF018SupComponent } from './tau-cscwf018-sup.component';

describe('TAUCSCWF018SupComponent', () => {
  let component: TAUCSCWF018SupComponent;
  let fixture: ComponentFixture<TAUCSCWF018SupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TAUCSCWF018SupComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TAUCSCWF018SupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

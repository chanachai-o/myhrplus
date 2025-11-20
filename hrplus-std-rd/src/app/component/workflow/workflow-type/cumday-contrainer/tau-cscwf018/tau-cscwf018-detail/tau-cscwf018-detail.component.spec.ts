import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TAUCSCWF018DetailComponent } from './tau-cscwf018-detail.component';

describe('TAUCSCWF018DetailComponent', () => {
  let component: TAUCSCWF018DetailComponent;
  let fixture: ComponentFixture<TAUCSCWF018DetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TAUCSCWF018DetailComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TAUCSCWF018DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

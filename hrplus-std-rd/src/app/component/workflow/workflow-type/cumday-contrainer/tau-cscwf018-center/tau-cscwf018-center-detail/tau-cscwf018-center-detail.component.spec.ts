import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TAUCSCWF018CenterDetailComponent } from './tau-cscwf018-center-detail.component';

describe('TAUCSCWF018CenterDetailComponent', () => {
  let component: TAUCSCWF018CenterDetailComponent;
  let fixture: ComponentFixture<TAUCSCWF018CenterDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TAUCSCWF018CenterDetailComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TAUCSCWF018CenterDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

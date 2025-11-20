import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TAUCSCWF018CenterComponent } from './tau-cscwf018-center.component';

describe('TAUCSCWF018CenterComponent', () => {
  let component: TAUCSCWF018CenterComponent;
  let fixture: ComponentFixture<TAUCSCWF018CenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TAUCSCWF018CenterComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TAUCSCWF018CenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TAUCSCWF006CreateComponent } from './tau-cscwf006-create.component';

describe('TAUCSCWF006CreateComponent', () => {
  let component: TAUCSCWF006CreateComponent;
  let fixture: ComponentFixture<TAUCSCWF006CreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TAUCSCWF006CreateComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TAUCSCWF006CreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

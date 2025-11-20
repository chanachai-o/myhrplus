import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TAUCSCWF123CreateComponent } from './tau-cscwf123-create.component';

describe('TAUCSCWF123CreateComponent', () => {
  let component: TAUCSCWF123CreateComponent;
  let fixture: ComponentFixture<TAUCSCWF123CreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TAUCSCWF123CreateComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TAUCSCWF123CreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

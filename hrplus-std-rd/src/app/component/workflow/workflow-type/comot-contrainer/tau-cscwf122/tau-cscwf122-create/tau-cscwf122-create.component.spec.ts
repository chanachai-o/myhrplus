import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TAUCSCWF122CreateComponent } from './tau-cscwf122-create.component';

describe('TAUCSCWF122CreateComponent', () => {
  let component: TAUCSCWF122CreateComponent;
  let fixture: ComponentFixture<TAUCSCWF122CreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TAUCSCWF122CreateComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TAUCSCWF122CreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

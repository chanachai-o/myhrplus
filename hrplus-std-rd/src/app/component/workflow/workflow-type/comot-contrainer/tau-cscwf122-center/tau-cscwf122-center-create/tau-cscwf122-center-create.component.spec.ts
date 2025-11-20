import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TAUCSCWF122CenterCreateComponent } from './tau-cscwf122-center-create.component';

describe('TAUCSCWF122CenterCreateComponent', () => {
  let component: TAUCSCWF122CenterCreateComponent;
  let fixture: ComponentFixture<TAUCSCWF122CenterCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TAUCSCWF122CenterCreateComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TAUCSCWF122CenterCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

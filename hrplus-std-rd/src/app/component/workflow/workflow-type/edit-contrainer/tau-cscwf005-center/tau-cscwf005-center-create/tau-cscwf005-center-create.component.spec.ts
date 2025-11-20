import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TAUCSCWF005CenterCreateComponent } from './tau-cscwf005-center-create.component';

describe('TAUCSCWF005CenterCreateComponent', () => {
  let component: TAUCSCWF005CenterCreateComponent;
  let fixture: ComponentFixture<TAUCSCWF005CenterCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TAUCSCWF005CenterCreateComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TAUCSCWF005CenterCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TAUCSCWF005CreateComponent } from './tau-cscwf005-create.component';

describe('TAUCSCWF005CreateComponent', () => {
  let component: TAUCSCWF005CreateComponent;
  let fixture: ComponentFixture<TAUCSCWF005CreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TAUCSCWF005CreateComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TAUCSCWF005CreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

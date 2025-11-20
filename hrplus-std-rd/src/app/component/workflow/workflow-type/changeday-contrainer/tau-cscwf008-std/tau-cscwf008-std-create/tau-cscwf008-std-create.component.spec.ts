import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TAUCSCWF008STDCreateComponent } from './tau-cscwf008-std-create.component';

describe('TAUCSCWF008STDCreateComponent', () => {
  let component: TAUCSCWF008STDCreateComponent;
  let fixture: ComponentFixture<TAUCSCWF008STDCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TAUCSCWF008STDCreateComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TAUCSCWF008STDCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

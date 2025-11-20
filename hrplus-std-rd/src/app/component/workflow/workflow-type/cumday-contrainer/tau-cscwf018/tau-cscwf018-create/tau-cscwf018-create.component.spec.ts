import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TAUCSCWF018CreateComponent } from './tau-cscwf018-create.component';

describe('TAUCSCWF018CreateComponent', () => {
  let component: TAUCSCWF018CreateComponent;
  let fixture: ComponentFixture<TAUCSCWF018CreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TAUCSCWF018CreateComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TAUCSCWF018CreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

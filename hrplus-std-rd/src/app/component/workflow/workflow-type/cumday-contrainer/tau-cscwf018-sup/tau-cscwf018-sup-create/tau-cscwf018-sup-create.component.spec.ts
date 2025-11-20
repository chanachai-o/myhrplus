import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TAUCSCWF018SupCreateComponent } from './tau-cscwf018-sup-create.component';

describe('TAUCSCWF018SupCreateComponent', () => {
  let component: TAUCSCWF018SupCreateComponent;
  let fixture: ComponentFixture<TAUCSCWF018SupCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TAUCSCWF018SupCreateComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TAUCSCWF018SupCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

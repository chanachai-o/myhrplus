import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TAUCSCWF018CenterCreateComponent } from './tau-cscwf018-center-create.component';

describe('TAUCSCWF018CenterCreateComponent', () => {
  let component: TAUCSCWF018CenterCreateComponent;
  let fixture: ComponentFixture<TAUCSCWF018CenterCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TAUCSCWF018CenterCreateComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TAUCSCWF018CenterCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

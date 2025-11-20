import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TauCscwf001HrCreateComponent } from './tau-cscwf001-hr-create.component';

describe('TauCscwf001HrCreateComponent', () => {
  let component: TauCscwf001HrCreateComponent;
  let fixture: ComponentFixture<TauCscwf001HrCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TauCscwf001HrCreateComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TauCscwf001HrCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

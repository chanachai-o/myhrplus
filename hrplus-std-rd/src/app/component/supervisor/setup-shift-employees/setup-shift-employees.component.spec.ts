import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupShiftEmployeesComponent } from './setup-shift-employees.component';

describe('SetupShiftEmployeesComponent', () => {
  let component: SetupShiftEmployeesComponent;
  let fixture: ComponentFixture<SetupShiftEmployeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SetupShiftEmployeesComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupShiftEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

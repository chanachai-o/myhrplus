import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTimeWarningComponent } from './employee-time-warning.component';

describe('EmployeeTimeWarningComponent', () => {
  let component: EmployeeTimeWarningComponent;
  let fixture: ComponentFixture<EmployeeTimeWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [EmployeeTimeWarningComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeTimeWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLeavestatisticComponent } from './employee-leavestatistic.component';

describe('EmployeeLeavestatisticComponent', () => {
  let component: EmployeeLeavestatisticComponent;
  let fixture: ComponentFixture<EmployeeLeavestatisticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [EmployeeLeavestatisticComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeLeavestatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

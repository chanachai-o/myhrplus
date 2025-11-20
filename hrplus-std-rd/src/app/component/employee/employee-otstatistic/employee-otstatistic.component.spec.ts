import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeOtstatisticComponent } from './employee-otstatistic.component';

describe('EmployeeOtstatisticComponent', () => {
  let component: EmployeeOtstatisticComponent;
  let fixture: ComponentFixture<EmployeeOtstatisticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [EmployeeOtstatisticComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeOtstatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

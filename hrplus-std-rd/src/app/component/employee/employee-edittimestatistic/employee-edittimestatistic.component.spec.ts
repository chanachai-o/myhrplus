import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeEdittimestatisticComponent } from './employee-edittimestatistic.component';

describe('EmployeeEdittimestatisticComponent', () => {
  let component: EmployeeEdittimestatisticComponent;
  let fixture: ComponentFixture<EmployeeEdittimestatisticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [EmployeeEdittimestatisticComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeEdittimestatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

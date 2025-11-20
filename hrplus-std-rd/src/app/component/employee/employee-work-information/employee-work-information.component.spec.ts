import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeWorkInformationComponent } from './employee-work-information.component';

describe('EmployeeWorkInformationComponent', () => {
  let component: EmployeeWorkInformationComponent;
  let fixture: ComponentFixture<EmployeeWorkInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [EmployeeWorkInformationComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeWorkInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

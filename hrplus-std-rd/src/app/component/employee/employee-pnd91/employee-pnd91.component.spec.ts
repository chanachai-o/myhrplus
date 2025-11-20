import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePnd91Component } from './employee-pnd91.component';

describe('EmployeePnd91Component', () => {
  let component: EmployeePnd91Component;
  let fixture: ComponentFixture<EmployeePnd91Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [EmployeePnd91Component]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeePnd91Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

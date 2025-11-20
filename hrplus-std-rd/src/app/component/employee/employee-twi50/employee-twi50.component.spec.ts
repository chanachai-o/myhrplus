import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTwi50Component } from './employee-twi50.component';

describe('EmployeeTwi50Component', () => {
  let component: EmployeeTwi50Component;
  let fixture: ComponentFixture<EmployeeTwi50Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [EmployeeTwi50Component]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeTwi50Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

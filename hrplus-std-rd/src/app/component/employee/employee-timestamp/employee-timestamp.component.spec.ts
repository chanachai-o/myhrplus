import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTimestampComponent } from './employee-timestamp.component';

describe('EmployeeTimestampComponent', () => {
  let component: EmployeeTimestampComponent;
  let fixture: ComponentFixture<EmployeeTimestampComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [EmployeeTimestampComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeTimestampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLeaveroleComponent } from './employee-leaverole.component';

describe('EmployeeLeaveroleComponent', () => {
  let component: EmployeeLeaveroleComponent;
  let fixture: ComponentFixture<EmployeeLeaveroleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [EmployeeLeaveroleComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeLeaveroleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

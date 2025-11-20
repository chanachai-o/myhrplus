import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupEmployeeProfileComponent } from './sup-employee-profile.component';

describe('SupEmployeeProfileComponent', () => {
  let component: SupEmployeeProfileComponent;
  let fixture: ComponentFixture<SupEmployeeProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SupEmployeeProfileComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupEmployeeProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

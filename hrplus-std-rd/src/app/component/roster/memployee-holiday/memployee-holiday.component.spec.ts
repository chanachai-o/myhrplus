import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemployeeHolidayComponent } from './memployee-holiday.component';

describe('MemployeeHolidayComponent', () => {
  let component: MemployeeHolidayComponent;
  let fixture: ComponentFixture<MemployeeHolidayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MemployeeHolidayComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemployeeHolidayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

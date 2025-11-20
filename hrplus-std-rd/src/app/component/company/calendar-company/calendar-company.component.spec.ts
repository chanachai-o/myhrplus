import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarCompanyComponent } from './calendar-company.component';

describe('CalendarCompanyComponent', () => {
  let component: CalendarCompanyComponent;
  let fixture: ComponentFixture<CalendarCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CalendarCompanyComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

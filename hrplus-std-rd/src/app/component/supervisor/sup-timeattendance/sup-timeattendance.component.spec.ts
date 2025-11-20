import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupTimeattendanceComponent } from './sup-timeattendance.component';

describe('SupTimeattendanceComponent', () => {
  let component: SupTimeattendanceComponent;
  let fixture: ComponentFixture<SupTimeattendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SupTimeattendanceComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupTimeattendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

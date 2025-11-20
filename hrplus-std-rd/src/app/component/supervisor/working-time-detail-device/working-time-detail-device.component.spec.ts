import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingTimeDetailDeviceComponent } from './working-time-detail-device.component';

describe('WorkingTimeDetailDeviceComponent', () => {
  let component: WorkingTimeDetailDeviceComponent;
  let fixture: ComponentFixture<WorkingTimeDetailDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [WorkingTimeDetailDeviceComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingTimeDetailDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupLeavestatisticComponent } from './sup-leavestatistic.component';

describe('SupLeavestatisticComponent', () => {
  let component: SupLeavestatisticComponent;
  let fixture: ComponentFixture<SupLeavestatisticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SupLeavestatisticComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupLeavestatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

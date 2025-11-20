import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingTimeDetailHistoryComponent } from './working-time-detail-history.component';

describe('WorkingTimeDetailHistoryComponent', () => {
  let component: WorkingTimeDetailHistoryComponent;
  let fixture: ComponentFixture<WorkingTimeDetailHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [WorkingTimeDetailHistoryComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingTimeDetailHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

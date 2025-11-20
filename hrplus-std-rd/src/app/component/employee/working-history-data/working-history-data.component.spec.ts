import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingHistoryDataComponent } from './working-history-data.component';

describe('WorkingHistoryDataComponent', () => {
  let component: WorkingHistoryDataComponent;
  let fixture: ComponentFixture<WorkingHistoryDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [WorkingHistoryDataComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingHistoryDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

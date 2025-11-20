import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowRemarkComponent } from './workflow-remark.component';

describe('WorkflowRemarkComponent', () => {
  let component: WorkflowRemarkComponent;
  let fixture: ComponentFixture<WorkflowRemarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [WorkflowRemarkComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowRemarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

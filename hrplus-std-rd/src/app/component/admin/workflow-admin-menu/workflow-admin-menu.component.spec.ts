import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowAdminMenuComponent } from './workflow-admin-menu.component';

describe('WorkflowAdminMenuComponent', () => {
  let component: WorkflowAdminMenuComponent;
  let fixture: ComponentFixture<WorkflowAdminMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [WorkflowAdminMenuComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowAdminMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

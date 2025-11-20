import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpviewWorkflowComponent } from './empview-workflow.component';

describe('EmpviewWorkflowComponent', () => {
  let component: EmpviewWorkflowComponent;
  let fixture: ComponentFixture<EmpviewWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [EmpviewWorkflowComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpviewWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

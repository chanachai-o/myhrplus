import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessEmpComponent } from './process-emp.component';

describe('ProcessEmpComponent', () => {
  let component: ProcessEmpComponent;
  let fixture: ComponentFixture<ProcessEmpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ProcessEmpComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessEmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

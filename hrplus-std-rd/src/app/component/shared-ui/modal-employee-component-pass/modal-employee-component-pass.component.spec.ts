import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEmployeeComponentPassComponent } from './modal-employee-component-pass.component';

describe('ModalEmployeeComponentPassComponent', () => {
  let component: ModalEmployeeComponentPassComponent;
  let fixture: ComponentFixture<ModalEmployeeComponentPassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ModalEmployeeComponentPassComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEmployeeComponentPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

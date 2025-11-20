import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmAssignWfComponent } from './adm-assign-wf.component';

describe('AdmAssignWfComponent', () => {
  let component: AdmAssignWfComponent;
  let fixture: ComponentFixture<AdmAssignWfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AdmAssignWfComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmAssignWfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

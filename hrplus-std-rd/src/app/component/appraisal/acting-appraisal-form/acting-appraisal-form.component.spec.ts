import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActingAppraisalFormComponent } from './acting-appraisal-form.component';

describe('ActingAppraisalFormComponent', () => {
  let component: ActingAppraisalFormComponent;
  let fixture: ComponentFixture<ActingAppraisalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ActingAppraisalFormComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(ActingAppraisalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

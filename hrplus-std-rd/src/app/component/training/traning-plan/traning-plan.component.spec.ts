import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraningPlanComponent } from './traning-plan.component';

describe('TraningPlanComponent', () => {
  let component: TraningPlanComponent;
  let fixture: ComponentFixture<TraningPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TraningPlanComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TraningPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

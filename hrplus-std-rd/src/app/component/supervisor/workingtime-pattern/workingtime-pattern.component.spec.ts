import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingtimePatternComponent } from './workingtime-pattern.component';

describe('WorkingtimePatternComponent', () => {
  let component: WorkingtimePatternComponent;
  let fixture: ComponentFixture<WorkingtimePatternComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [WorkingtimePatternComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingtimePatternComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

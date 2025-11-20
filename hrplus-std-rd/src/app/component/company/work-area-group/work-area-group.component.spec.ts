import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkAreaGroupComponent } from './work-area-group.component';

describe('WorkAreaGroupComponent', () => {
  let component: WorkAreaGroupComponent;
  let fixture: ComponentFixture<WorkAreaGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [WorkAreaGroupComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkAreaGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

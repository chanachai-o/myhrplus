import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedWorkComponent } from './assigned-work.component';

describe('AssignedWorkComponent', () => {
  let component: AssignedWorkComponent;
  let fixture: ComponentFixture<AssignedWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AssignedWorkComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(AssignedWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

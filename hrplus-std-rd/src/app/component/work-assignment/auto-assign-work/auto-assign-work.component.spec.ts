import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoAssignWorkComponent } from './auto-assign-work.component';

describe('AutoAssignWorkComponent', () => {
  let component: AutoAssignWorkComponent;
  let fixture: ComponentFixture<AutoAssignWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AutoAssignWorkComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoAssignWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

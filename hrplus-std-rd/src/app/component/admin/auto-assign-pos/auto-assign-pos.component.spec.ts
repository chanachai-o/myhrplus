import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoAssignPosComponent } from './auto-assign-pos.component';

describe('AutoAssignPosComponent', () => {
  let component: AutoAssignPosComponent;
  let fixture: ComponentFixture<AutoAssignPosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AutoAssignPosComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoAssignPosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

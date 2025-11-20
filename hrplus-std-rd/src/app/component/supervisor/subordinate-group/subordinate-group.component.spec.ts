import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubordinateGroupComponent } from './subordinate-group.component';

describe('SubordinateGroupComponent', () => {
  let component: SubordinateGroupComponent;
  let fixture: ComponentFixture<SubordinateGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SubordinateGroupComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubordinateGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

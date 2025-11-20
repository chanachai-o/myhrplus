import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighCostComponent } from './high-cost.component';

describe('HighCostComponent', () => {
  let component: HighCostComponent;
  let fixture: ComponentFixture<HighCostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [HighCostComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HighCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

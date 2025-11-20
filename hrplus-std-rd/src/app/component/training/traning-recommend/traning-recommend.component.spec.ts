import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraningRecommendComponent } from './traning-recommend.component';

describe('TraningRecommendComponent', () => {
  let component: TraningRecommendComponent;
  let fixture: ComponentFixture<TraningRecommendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TraningRecommendComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TraningRecommendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

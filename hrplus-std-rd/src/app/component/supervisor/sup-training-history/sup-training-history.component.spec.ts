import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupTrainingHistoryComponent } from './sup-training-history.component';

describe('SupTrainingHistoryComponent', () => {
  let component: SupTrainingHistoryComponent;
  let fixture: ComponentFixture<SupTrainingHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SupTrainingHistoryComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupTrainingHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

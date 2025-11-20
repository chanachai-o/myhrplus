import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraningHistoryComponent } from './traning-history.component';

describe('TraningHistoryComponent', () => {
  let component: TraningHistoryComponent;
  let fixture: ComponentFixture<TraningHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TraningHistoryComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TraningHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

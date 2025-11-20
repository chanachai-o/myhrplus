import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelfareHistoryComponent } from './welfare-history.component';

describe('WelfareHistoryComponent', () => {
  let component: WelfareHistoryComponent;
  let fixture: ComponentFixture<WelfareHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [WelfareHistoryComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WelfareHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackpayComponent } from './backpay.component';

describe('BackpayComponent', () => {
  let component: BackpayComponent;
  let fixture: ComponentFixture<BackpayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [BackpayComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackpayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

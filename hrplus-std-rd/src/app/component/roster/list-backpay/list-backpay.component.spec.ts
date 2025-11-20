import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBackpayComponent } from './list-backpay.component';

describe('ListBackpayComponent', () => {
  let component: ListBackpayComponent;
  let fixture: ComponentFixture<ListBackpayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ListBackpayComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBackpayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

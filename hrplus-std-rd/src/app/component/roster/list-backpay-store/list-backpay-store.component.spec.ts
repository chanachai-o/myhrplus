import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBackpayStoreComponent } from './list-backpay-store.component';

describe('ListBackpayStoreComponent', () => {
  let component: ListBackpayStoreComponent;
  let fixture: ComponentFixture<ListBackpayStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ListBackpayStoreComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBackpayStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

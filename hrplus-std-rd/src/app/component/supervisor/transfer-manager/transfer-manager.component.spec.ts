import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferManagerComponent } from './transfer-manager.component';

describe('TransferManagerComponent', () => {
  let component: TransferManagerComponent;
  let fixture: ComponentFixture<TransferManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TransferManagerComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

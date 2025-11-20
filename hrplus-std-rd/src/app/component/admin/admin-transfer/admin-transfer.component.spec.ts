import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTransferComponent } from './admin-transfer.component';

describe('AdminTransferComponent', () => {
  let component: AdminTransferComponent;
  let fixture: ComponentFixture<AdminTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AdminTransferComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

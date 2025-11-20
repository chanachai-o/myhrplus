import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RgmApprovedByStoreComponent } from './rgm-approved-by-store.component';

describe('RgmApprovedByStoreComponent', () => {
  let component: RgmApprovedByStoreComponent;
  let fixture: ComponentFixture<RgmApprovedByStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RgmApprovedByStoreComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RgmApprovedByStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

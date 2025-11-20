import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcApprovedAllStoreComponent } from './ac-approved-all-store.component';

describe('AcApprovedAllStoreComponent', () => {
  let component: AcApprovedAllStoreComponent;
  let fixture: ComponentFixture<AcApprovedAllStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AcApprovedAllStoreComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcApprovedAllStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

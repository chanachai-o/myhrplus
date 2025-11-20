import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcApprovedByStoreComponent } from './ac-approved-by-store.component';

describe('AcApprovedByStoreComponent', () => {
  let component: AcApprovedByStoreComponent;
  let fixture: ComponentFixture<AcApprovedByStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AcApprovedByStoreComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcApprovedByStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

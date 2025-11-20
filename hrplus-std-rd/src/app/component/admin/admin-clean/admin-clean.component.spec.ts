import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCleanComponent } from './admin-clean.component';

describe('AdminCleanComponent', () => {
  let component: AdminCleanComponent;
  let fixture: ComponentFixture<AdminCleanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AdminCleanComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCleanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

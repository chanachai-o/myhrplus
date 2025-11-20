import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewadminCleanComponent } from './viewadmin-clean.component';

describe('ViewadminCleanComponent', () => {
  let component: ViewadminCleanComponent;
  let fixture: ComponentFixture<ViewadminCleanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ViewadminCleanComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewadminCleanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

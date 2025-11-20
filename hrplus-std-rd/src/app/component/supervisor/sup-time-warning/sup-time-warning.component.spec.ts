import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupTimeWarningComponent } from './sup-time-warning.component';

describe('SupTimeWarningComponent', () => {
  let component: SupTimeWarningComponent;
  let fixture: ComponentFixture<SupTimeWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SupTimeWarningComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupTimeWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

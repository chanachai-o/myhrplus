import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiShiftplanSubComponent } from './pi-shiftplan-sub.component';

describe('PiShiftplanSubComponent', () => {
  let component: PiShiftplanSubComponent;
  let fixture: ComponentFixture<PiShiftplanSubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [PiShiftplanSubComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PiShiftplanSubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

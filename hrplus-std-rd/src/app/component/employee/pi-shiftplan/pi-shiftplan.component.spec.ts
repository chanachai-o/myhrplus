import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiShiftplanComponent } from './pi-shiftplan.component';

describe('PiShiftplanComponent', () => {
  let component: PiShiftplanComponent;
  let fixture: ComponentFixture<PiShiftplanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [PiShiftplanComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PiShiftplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WageSheetAppendComponent } from './wage-sheet-append.component';

describe('WageSheetAppendComponent', () => {
  let component: WageSheetAppendComponent;
  let fixture: ComponentFixture<WageSheetAppendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [WageSheetAppendComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WageSheetAppendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

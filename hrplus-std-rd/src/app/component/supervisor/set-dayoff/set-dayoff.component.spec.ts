import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetDayoffComponent } from './set-dayoff.component';

describe('SetDayoffComponent', () => {
  let component: SetDayoffComponent;
  let fixture: ComponentFixture<SetDayoffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SetDayoffComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetDayoffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

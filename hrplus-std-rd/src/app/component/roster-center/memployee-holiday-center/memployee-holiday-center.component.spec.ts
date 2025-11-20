/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MemployeeHolidayCenterComponent } from './memployee-holiday-center.component';

describe('MemployeeHolidayCenterComponent', () => {
  let component: MemployeeHolidayCenterComponent;
  let fixture: ComponentFixture<MemployeeHolidayCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [MemployeeHolidayCenterComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemployeeHolidayCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

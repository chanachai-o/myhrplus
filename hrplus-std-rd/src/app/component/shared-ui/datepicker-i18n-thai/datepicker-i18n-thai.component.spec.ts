/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DatepickerI18nThaiComponent } from './datepicker-i18n-thai.component';

describe('DatepickerI18nThaiComponent', () => {
  let component: DatepickerI18nThaiComponent;
  let fixture: ComponentFixture<DatepickerI18nThaiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [DatepickerI18nThaiComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatepickerI18nThaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

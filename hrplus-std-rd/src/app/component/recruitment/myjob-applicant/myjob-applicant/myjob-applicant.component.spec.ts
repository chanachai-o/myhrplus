/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MyjobApplicantComponent } from './myjob-applicant.component';

describe('MyjobApplicantComponent', () => {
  let component: MyjobApplicantComponent;
  let fixture: ComponentFixture<MyjobApplicantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [MyjobApplicantComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyjobApplicantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

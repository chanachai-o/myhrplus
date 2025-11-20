/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ResultOfWorkCenterComponent } from './result-of-work-center.component';

describe('ResultOfWorkCenterComponent', () => {
  let component: ResultOfWorkCenterComponent;
  let fixture: ComponentFixture<ResultOfWorkCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [ResultOfWorkCenterComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultOfWorkCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

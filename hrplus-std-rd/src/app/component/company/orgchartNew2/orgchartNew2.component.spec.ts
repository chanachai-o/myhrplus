/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OrgchartNew2Component } from './orgchartNew2.component';

describe('OrgchartNew2Component', () => {
  let component: OrgchartNew2Component;
  let fixture: ComponentFixture<OrgchartNew2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [OrgchartNew2Component]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgchartNew2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WfRepareRoutingComponent } from './wf-repare-routing.component';

describe('WfRepareRoutingComponent', () => {
  let component: WfRepareRoutingComponent;
  let fixture: ComponentFixture<WfRepareRoutingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [WfRepareRoutingComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WfRepareRoutingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

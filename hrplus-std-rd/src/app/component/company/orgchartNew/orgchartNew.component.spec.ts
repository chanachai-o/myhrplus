/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OrgchartNewComponent } from './orgchartNew.component';

describe('OrgchartNewComponent', () => {
  let component: OrgchartNewComponent;
  let fixture: ComponentFixture<OrgchartNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [OrgchartNewComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgchartNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

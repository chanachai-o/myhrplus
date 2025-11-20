/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OrgchartSaleComponent } from './orgchartSale.component';

describe('OrgchartSaleComponent', () => {
  let component: OrgchartSaleComponent;
  let fixture: ComponentFixture<OrgchartSaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [OrgchartSaleComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgchartSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

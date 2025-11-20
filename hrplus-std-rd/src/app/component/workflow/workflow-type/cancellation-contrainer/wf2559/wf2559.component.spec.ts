import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Wf2559Component } from './wf2559.component';

describe('Wf2559Component', () => {
  let component: Wf2559Component;
  let fixture: ComponentFixture<Wf2559Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Wf2559Component]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Wf2559Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

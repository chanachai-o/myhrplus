import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Wf2559SupComponent } from './wf2559-sup.component';

describe('Wf2559SupComponent', () => {
  let component: Wf2559SupComponent;
  let fixture: ComponentFixture<Wf2559SupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Wf2559SupComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Wf2559SupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

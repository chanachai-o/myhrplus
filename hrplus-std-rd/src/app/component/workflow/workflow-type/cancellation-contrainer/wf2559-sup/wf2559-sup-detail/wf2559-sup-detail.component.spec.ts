import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Wf2559SupDetailComponent } from './wf2559-sup-detail.component';

describe('Wf2559SupDetailComponent', () => {
  let component: Wf2559SupDetailComponent;
  let fixture: ComponentFixture<Wf2559SupDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Wf2559SupDetailComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Wf2559SupDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Wf2559CenterDetailComponent } from './wf2559-center-detail.component';

describe('Wf2559CenterDetailComponent', () => {
  let component: Wf2559CenterDetailComponent;
  let fixture: ComponentFixture<Wf2559CenterDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Wf2559CenterDetailComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Wf2559CenterDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

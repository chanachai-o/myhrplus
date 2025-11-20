import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Wf2559CenterComponent } from './wf2559-center.component';

describe('Wf2559CenterComponent', () => {
  let component: Wf2559CenterComponent;
  let fixture: ComponentFixture<Wf2559CenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Wf2559CenterComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Wf2559CenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

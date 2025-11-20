import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WfCommandlineComponent } from './wf-commandline.component';

describe('WfCommandlineComponent', () => {
  let component: WfCommandlineComponent;
  let fixture: ComponentFixture<WfCommandlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [WfCommandlineComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WfCommandlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

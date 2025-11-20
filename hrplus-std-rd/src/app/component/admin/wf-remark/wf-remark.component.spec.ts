import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WfRemarkComponent } from './wf-remark.component';

describe('WfRemarkComponent', () => {
  let component: WfRemarkComponent;
  let fixture: ComponentFixture<WfRemarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [WfRemarkComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WfRemarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

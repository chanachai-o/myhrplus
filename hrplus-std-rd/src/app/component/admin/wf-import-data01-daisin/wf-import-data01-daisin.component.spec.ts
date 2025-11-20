import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WfImportData01DaisinComponent } from './wf-import-data01-daisin.component';

describe('WfImportData01DaisinComponent', () => {
  let component: WfImportData01DaisinComponent;
  let fixture: ComponentFixture<WfImportData01DaisinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [WfImportData01DaisinComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WfImportData01DaisinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

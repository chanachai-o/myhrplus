import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WfImportExportDataComponent } from './wf-import-export-data.component';

describe('WfImportExportDataComponent', () => {
  let component: WfImportExportDataComponent;
  let fixture: ComponentFixture<WfImportExportDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [WfImportExportDataComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WfImportExportDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

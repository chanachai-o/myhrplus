import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportMtime2Component } from './import-mtime2.component';

describe('ImportMtime2Component', () => {
  let component: ImportMtime2Component;
  let fixture: ComponentFixture<ImportMtime2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ImportMtime2Component]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportMtime2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

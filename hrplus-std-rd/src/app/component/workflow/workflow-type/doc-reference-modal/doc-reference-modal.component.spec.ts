import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocReferenceModalComponent } from './doc-reference-modal.component';

describe('DocReferenceModalComponent', () => {
  let component: DocReferenceModalComponent;
  let fixture: ComponentFixture<DocReferenceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [DocReferenceModalComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocReferenceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

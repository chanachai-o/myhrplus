import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCandidateComponent } from './table-candidate.component';

describe('TableCandidateComponent', () => {
  let component: TableCandidateComponent;
  let fixture: ComponentFixture<TableCandidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TableCandidateComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecCandidateComponent } from './rec-candidate.component';

describe('RecCandidateComponent', () => {
  let component: RecCandidateComponent;
  let fixture: ComponentFixture<RecCandidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RecCandidateComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

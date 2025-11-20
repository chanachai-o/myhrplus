import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pwf014SupDetailComponent } from './pwf014-sup-detail.component';

describe('Pwf014SupDetailComponent', () => {
  let component: Pwf014SupDetailComponent;
  let fixture: ComponentFixture<Pwf014SupDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Pwf014SupDetailComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Pwf014SupDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

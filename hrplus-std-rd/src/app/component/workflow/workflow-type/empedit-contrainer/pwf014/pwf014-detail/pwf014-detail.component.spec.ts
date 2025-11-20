import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pwf014DetailComponent } from './pwf014-detail.component';

describe('Pwf014DetailComponent', () => {
  let component: Pwf014DetailComponent;
  let fixture: ComponentFixture<Pwf014DetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Pwf014DetailComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Pwf014DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

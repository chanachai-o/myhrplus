import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pwf001DetailComponent } from './pwf001-detail.component';

describe('Pwf001DetailComponent', () => {
  let component: Pwf001DetailComponent;
  let fixture: ComponentFixture<Pwf001DetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Pwf001DetailComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Pwf001DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

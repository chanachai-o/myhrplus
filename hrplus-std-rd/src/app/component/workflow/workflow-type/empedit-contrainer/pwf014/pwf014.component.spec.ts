import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pwf014Component } from './pwf014.component';

describe('Pwf014Component', () => {
  let component: Pwf014Component;
  let fixture: ComponentFixture<Pwf014Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Pwf014Component]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Pwf014Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

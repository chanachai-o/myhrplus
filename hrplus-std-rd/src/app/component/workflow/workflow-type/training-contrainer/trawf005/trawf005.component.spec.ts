import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Trawf005Component } from './trawf005.component';

describe('Trawf005Component', () => {
  let component: Trawf005Component;
  let fixture: ComponentFixture<Trawf005Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Trawf005Component]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Trawf005Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

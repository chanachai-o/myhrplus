import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Trawf009Component } from './trawf009.component';

describe('Trawf009Component', () => {
  let component: Trawf009Component;
  let fixture: ComponentFixture<Trawf009Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Trawf009Component]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Trawf009Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

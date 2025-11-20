import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Trawf007Component } from './trawf007.component';

describe('Trawf007Component', () => {
  let component: Trawf007Component;
  let fixture: ComponentFixture<Trawf007Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Trawf007Component]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Trawf007Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

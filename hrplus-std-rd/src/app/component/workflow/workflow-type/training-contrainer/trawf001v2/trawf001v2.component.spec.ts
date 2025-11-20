import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Trawf001v2Component } from './trawf001v2.component';

describe('Trawf001v2Component', () => {
  let component: Trawf001v2Component;
  let fixture: ComponentFixture<Trawf001v2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Trawf001v2Component]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Trawf001v2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

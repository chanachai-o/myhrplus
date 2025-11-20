import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Welwf001Component } from './welwf001.component';

describe('Welwf001Component', () => {
  let component: Welwf001Component;
  let fixture: ComponentFixture<Welwf001Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Welwf001Component]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Welwf001Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

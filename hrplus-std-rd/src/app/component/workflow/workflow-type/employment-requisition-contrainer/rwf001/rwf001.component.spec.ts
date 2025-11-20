import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Rwf001Component } from './rwf001.component';

describe('Rwf001Component', () => {
  let component: Rwf001Component;
  let fixture: ComponentFixture<Rwf001Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Rwf001Component]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Rwf001Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

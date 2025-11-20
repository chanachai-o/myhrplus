import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Trawf0071Component } from './trawf0071.component';

describe('Trawf0071Component', () => {
  let component: Trawf0071Component;
  let fixture: ComponentFixture<Trawf0071Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Trawf0071Component]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Trawf0071Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

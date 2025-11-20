import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Trawf009DetailComponent } from './trawf009-detail.component';

describe('Trawf009DetailComponent', () => {
  let component: Trawf009DetailComponent;
  let fixture: ComponentFixture<Trawf009DetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Trawf009DetailComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Trawf009DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

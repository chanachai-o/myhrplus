import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Trawf007DetailComponent } from './trawf007-detail.component';

describe('Trawf007DetailComponent', () => {
  let component: Trawf007DetailComponent;
  let fixture: ComponentFixture<Trawf007DetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Trawf007DetailComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Trawf007DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Trawf005DetailComponent } from './trawf005-detail.component';

describe('Trawf005DetailComponent', () => {
  let component: Trawf005DetailComponent;
  let fixture: ComponentFixture<Trawf005DetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Trawf005DetailComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Trawf005DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

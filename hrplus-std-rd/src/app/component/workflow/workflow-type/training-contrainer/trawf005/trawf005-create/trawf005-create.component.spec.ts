import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Trawf005CreateComponent } from './trawf005-create.component';

describe('Trawf005CreateComponent', () => {
  let component: Trawf005CreateComponent;
  let fixture: ComponentFixture<Trawf005CreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Trawf005CreateComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Trawf005CreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

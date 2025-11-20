import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Trawf009CreateComponent } from './trawf009-create.component';

describe('Trawf009CreateComponent', () => {
  let component: Trawf009CreateComponent;
  let fixture: ComponentFixture<Trawf009CreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Trawf009CreateComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Trawf009CreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

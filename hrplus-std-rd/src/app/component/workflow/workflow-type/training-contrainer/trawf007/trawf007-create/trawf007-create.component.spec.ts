import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Trawf007CreateComponent } from './trawf007-create.component';

describe('Trawf007CreateComponent', () => {
  let component: Trawf007CreateComponent;
  let fixture: ComponentFixture<Trawf007CreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Trawf007CreateComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Trawf007CreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Trawf001v2CreateComponent } from './trawf001v2-create.component';

describe('Trawf001v2CreateComponent', () => {
  let component: Trawf001v2CreateComponent;
  let fixture: ComponentFixture<Trawf001v2CreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Trawf001v2CreateComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Trawf001v2CreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

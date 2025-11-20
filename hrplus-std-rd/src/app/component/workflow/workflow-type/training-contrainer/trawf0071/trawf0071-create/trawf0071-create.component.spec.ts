import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Trawf0071CreateComponent } from './trawf0071-create.component';

describe('Trawf0071CreateComponent', () => {
  let component: Trawf0071CreateComponent;
  let fixture: ComponentFixture<Trawf0071CreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Trawf0071CreateComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Trawf0071CreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

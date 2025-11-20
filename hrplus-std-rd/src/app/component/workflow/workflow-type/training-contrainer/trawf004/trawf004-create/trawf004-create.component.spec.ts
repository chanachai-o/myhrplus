import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Trawf004CreateComponent } from './trawf004-create.component';

describe('Trawf004CreateComponent', () => {
  let component: Trawf004CreateComponent;
  let fixture: ComponentFixture<Trawf004CreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Trawf004CreateComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Trawf004CreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

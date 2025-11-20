import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TauCscwf009CreateComponent } from './tau-cscwf009-create.component';

describe('TauCscwf009CreateComponent', () => {
  let component: TauCscwf009CreateComponent;
  let fixture: ComponentFixture<TauCscwf009CreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TauCscwf009CreateComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TauCscwf009CreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

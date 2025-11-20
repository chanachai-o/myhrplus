import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TauCscwf001CreateComponent } from './tau-cscwf001-create.component';

describe('TauCscwf001CreateComponent', () => {
  let component: TauCscwf001CreateComponent;
  let fixture: ComponentFixture<TauCscwf001CreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TauCscwf001CreateComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TauCscwf001CreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

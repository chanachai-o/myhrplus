import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TauCscwf009CenterCreateComponent } from './tau-cscwf009-center-create.component';

describe('TauCscwf009CenterCreateComponent', () => {
  let component: TauCscwf009CenterCreateComponent;
  let fixture: ComponentFixture<TauCscwf009CenterCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TauCscwf009CenterCreateComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TauCscwf009CenterCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

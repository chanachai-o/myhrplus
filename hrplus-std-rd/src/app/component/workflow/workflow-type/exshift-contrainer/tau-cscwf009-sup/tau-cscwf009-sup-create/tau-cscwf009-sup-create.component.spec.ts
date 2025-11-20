import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TauCscwf009SupCreateComponent } from './tau-cscwf009-sup-create.component';

describe('TauCscwf009SupCreateComponent', () => {
  let component: TauCscwf009SupCreateComponent;
  let fixture: ComponentFixture<TauCscwf009SupCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TauCscwf009SupCreateComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TauCscwf009SupCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

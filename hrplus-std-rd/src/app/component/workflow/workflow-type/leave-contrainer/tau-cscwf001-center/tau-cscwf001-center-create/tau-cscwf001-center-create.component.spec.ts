import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TauCscwf001CenterCreateComponent } from './tau-cscwf001-center-create.component';

describe('TauCscwf001CenterCreateComponent', () => {
  let component: TauCscwf001CenterCreateComponent;
  let fixture: ComponentFixture<TauCscwf001CenterCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TauCscwf001CenterCreateComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TauCscwf001CenterCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

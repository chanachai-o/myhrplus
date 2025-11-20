import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TauCscwf009CenterComponent } from './tau-cscwf009-center.component';

describe('TauCscwf009CenterComponent', () => {
  let component: TauCscwf009CenterComponent;
  let fixture: ComponentFixture<TauCscwf009CenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TauCscwf009CenterComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TauCscwf009CenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

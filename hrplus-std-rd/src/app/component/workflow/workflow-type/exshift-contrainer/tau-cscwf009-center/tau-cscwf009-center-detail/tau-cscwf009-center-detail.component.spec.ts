import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TauCscwf009CenterDetailComponent } from './tau-cscwf009-center-detail.component';

describe('TauCscwf009CenterDetailComponent', () => {
  let component: TauCscwf009CenterDetailComponent;
  let fixture: ComponentFixture<TauCscwf009CenterDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TauCscwf009CenterDetailComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TauCscwf009CenterDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

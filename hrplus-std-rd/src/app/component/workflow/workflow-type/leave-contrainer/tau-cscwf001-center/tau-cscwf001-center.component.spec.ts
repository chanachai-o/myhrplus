import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TauCscwf001CenterComponent } from './tau-cscwf001-center.component';

describe('TauCscwf001CenterComponent', () => {
  let component: TauCscwf001CenterComponent;
  let fixture: ComponentFixture<TauCscwf001CenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TauCscwf001CenterComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TauCscwf001CenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

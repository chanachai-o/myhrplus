import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TauCscwf001HrDetailComponent } from './tau-cscwf001-hr-detail.component';

describe('TauCscwf001HrDetailComponent', () => {
  let component: TauCscwf001HrDetailComponent;
  let fixture: ComponentFixture<TauCscwf001HrDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TauCscwf001HrDetailComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TauCscwf001HrDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

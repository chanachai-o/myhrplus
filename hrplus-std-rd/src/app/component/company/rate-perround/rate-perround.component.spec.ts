import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatePerroundComponent } from './rate-perround.component';

describe('RatePerroundComponent', () => {
  let component: RatePerroundComponent;
  let fixture: ComponentFixture<RatePerroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RatePerroundComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RatePerroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvidentFundSupDetailComponent } from './provident-fund-sup-detail.component';

describe('ProvidentFundSupDetailComponent', () => {
  let component: ProvidentFundSupDetailComponent;
  let fixture: ComponentFixture<ProvidentFundSupDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ProvidentFundSupDetailComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvidentFundSupDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

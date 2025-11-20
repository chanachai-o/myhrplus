import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvidentFundRegDetailComponent } from './provident-fund-reg-detail.component';

describe('ProvidentFundRegDetailComponent', () => {
  let component: ProvidentFundRegDetailComponent;
  let fixture: ComponentFixture<ProvidentFundRegDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ProvidentFundRegDetailComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvidentFundRegDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

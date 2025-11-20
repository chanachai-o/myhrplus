import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvidentFundRegCreateComponent } from './provident-fund-reg-create.component';

describe('ProvidentFundRegCreateComponent', () => {
  let component: ProvidentFundRegCreateComponent;
  let fixture: ComponentFixture<ProvidentFundRegCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ProvidentFundRegCreateComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvidentFundRegCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

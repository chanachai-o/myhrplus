import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvidentFundSupCreateComponent } from './provident-fund-sup-create.component';

describe('ProvidentFundSupCreateComponent', () => {
  let component: ProvidentFundSupCreateComponent;
  let fixture: ComponentFixture<ProvidentFundSupCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ProvidentFundSupCreateComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvidentFundSupCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

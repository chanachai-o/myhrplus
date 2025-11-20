import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelfareOffsiteCreateComponent } from './welfare-offsite-create.component';

describe('WelfareOffsiteCreateComponent', () => {
  let component: WelfareOffsiteCreateComponent;
  let fixture: ComponentFixture<WelfareOffsiteCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [WelfareOffsiteCreateComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(WelfareOffsiteCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

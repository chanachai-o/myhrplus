import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelfareOffsiteDetailComponent } from './welfare-offsite-detail.component';

describe('WelfareOffsiteDetailComponent', () => {
  let component: WelfareOffsiteDetailComponent;
  let fixture: ComponentFixture<WelfareOffsiteDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [WelfareOffsiteDetailComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(WelfareOffsiteDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

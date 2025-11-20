import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelfareCheckComponent } from './welfare-check.component';

describe('WelfareCheckComponent', () => {
  let component: WelfareCheckComponent;
  let fixture: ComponentFixture<WelfareCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [WelfareCheckComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WelfareCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

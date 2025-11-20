import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaskToggleComponent } from './mask-toggle.component';

describe('MaskToggleComponent', () => {
  let component: MaskToggleComponent;
  let fixture: ComponentFixture<MaskToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MaskToggleComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(MaskToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

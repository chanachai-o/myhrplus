import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Rwf001DetailComponent } from './rwf001-detail.component';

describe('Rwf001DetailComponent', () => {
  let component: Rwf001DetailComponent;
  let fixture: ComponentFixture<Rwf001DetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Rwf001DetailComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Rwf001DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

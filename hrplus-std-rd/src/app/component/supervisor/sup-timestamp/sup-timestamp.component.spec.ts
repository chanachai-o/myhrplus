import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupTimestampComponent } from './sup-timestamp.component';

describe('SupTimestampComponent', () => {
  let component: SupTimestampComponent;
  let fixture: ComponentFixture<SupTimestampComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SupTimestampComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupTimestampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

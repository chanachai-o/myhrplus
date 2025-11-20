import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TroubleBoxComponent } from './trouble-box.component';

describe('TroubleBoxComponent', () => {
  let component: TroubleBoxComponent;
  let fixture: ComponentFixture<TroubleBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TroubleBoxComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TroubleBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

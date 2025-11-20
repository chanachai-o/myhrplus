import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Trawf004DetailComponent } from './trawf004-detail.component';

describe('Trawf004DetailComponent', () => {
  let component: Trawf004DetailComponent;
  let fixture: ComponentFixture<Trawf004DetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Trawf004DetailComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Trawf004DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

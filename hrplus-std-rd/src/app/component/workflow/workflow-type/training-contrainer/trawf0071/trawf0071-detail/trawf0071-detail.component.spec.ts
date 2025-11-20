import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Trawf0071DetailComponent } from './trawf0071-detail.component';

describe('Trawf0071DetailComponent', () => {
  let component: Trawf0071DetailComponent;
  let fixture: ComponentFixture<Trawf0071DetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Trawf0071DetailComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Trawf0071DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

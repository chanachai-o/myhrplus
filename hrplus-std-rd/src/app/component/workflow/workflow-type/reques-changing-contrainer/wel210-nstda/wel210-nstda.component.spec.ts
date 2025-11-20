import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Wel210NstdaComponent } from './wel210-nstda.component';

describe('Wel210NstdaComponent', () => {
  let component: Wel210NstdaComponent;
  let fixture: ComponentFixture<Wel210NstdaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Wel210NstdaComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Wel210NstdaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

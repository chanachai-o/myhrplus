import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Wel210NstdaDetailComponent } from './wel210-nstda-detail.component';

describe('Wel210NstdaDetailComponent', () => {
  let component: Wel210NstdaDetailComponent;
  let fixture: ComponentFixture<Wel210NstdaDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Wel210NstdaDetailComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Wel210NstdaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

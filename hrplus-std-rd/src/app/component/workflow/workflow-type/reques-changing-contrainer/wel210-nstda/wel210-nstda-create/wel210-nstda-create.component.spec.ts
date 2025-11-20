import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Wel210NstdaCreateComponent } from './wel210-nstda-create.component';

describe('Wel210NstdaCreateComponent', () => {
  let component: Wel210NstdaCreateComponent;
  let fixture: ComponentFixture<Wel210NstdaCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Wel210NstdaCreateComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Wel210NstdaCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

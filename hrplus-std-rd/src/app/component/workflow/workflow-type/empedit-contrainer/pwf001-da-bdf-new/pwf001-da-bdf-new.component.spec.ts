import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pwf001DABDFNEWComponent } from './pwf001-da-bdf-new.component';

describe('Pwf001DABDFNEWComponent', () => {
  let component: Pwf001DABDFNEWComponent;
  let fixture: ComponentFixture<Pwf001DABDFNEWComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Pwf001DABDFNEWComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Pwf001DABDFNEWComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

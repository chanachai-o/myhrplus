import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pwf014SupComponent } from './pwf014-sup.component';

describe('Pwf014SupComponent', () => {
  let component: Pwf014SupComponent;
  let fixture: ComponentFixture<Pwf014SupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Pwf014SupComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Pwf014SupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

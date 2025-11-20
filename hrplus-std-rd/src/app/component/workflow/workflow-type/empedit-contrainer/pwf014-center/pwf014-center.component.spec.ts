import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pwf014CenterComponent } from './pwf014-center.component';

describe('Pwf014CenterComponent', () => {
  let component: Pwf014CenterComponent;
  let fixture: ComponentFixture<Pwf014CenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Pwf014CenterComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Pwf014CenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pwf014CenterDetailComponent } from './pwf014-center-detail.component';

describe('Pwf014CenterDetailComponent', () => {
  let component: Pwf014CenterDetailComponent;
  let fixture: ComponentFixture<Pwf014CenterDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Pwf014CenterDetailComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Pwf014CenterDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

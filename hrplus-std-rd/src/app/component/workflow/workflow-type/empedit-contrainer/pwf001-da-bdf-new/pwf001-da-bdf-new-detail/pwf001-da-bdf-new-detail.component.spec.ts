import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pwf001DaBdfNewDetailComponent } from './pwf001-da-bdf-new-detail.component';

describe('Pwf001DaBdfNewDetailComponent', () => {
  let component: Pwf001DaBdfNewDetailComponent;
  let fixture: ComponentFixture<Pwf001DaBdfNewDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Pwf001DaBdfNewDetailComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Pwf001DaBdfNewDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

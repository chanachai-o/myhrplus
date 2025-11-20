import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pwf017RecruitComponent } from './pwf017-recruit.component';

describe('Pwf017RecruitComponent', () => {
  let component: Pwf017RecruitComponent;
  let fixture: ComponentFixture<Pwf017RecruitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Pwf017RecruitComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Pwf017RecruitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

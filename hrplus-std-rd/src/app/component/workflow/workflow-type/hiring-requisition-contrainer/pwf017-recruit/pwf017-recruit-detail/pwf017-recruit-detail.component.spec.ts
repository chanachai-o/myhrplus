import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pwf017RecruitDetailComponent } from './pwf017-recruit-detail.component';

describe('Pwf017RecruitDetailComponent', () => {
  let component: Pwf017RecruitDetailComponent;
  let fixture: ComponentFixture<Pwf017RecruitDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Pwf017RecruitDetailComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Pwf017RecruitDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

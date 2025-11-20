import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultOfWorkComponent } from './result-of-work.component';

describe('ResultOfWorkComponent', () => {
  let component: ResultOfWorkComponent;
  let fixture: ComponentFixture<ResultOfWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ResultOfWorkComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultOfWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

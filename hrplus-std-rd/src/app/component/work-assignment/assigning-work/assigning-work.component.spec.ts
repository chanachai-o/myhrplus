import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssigningWorkComponent } from './assigning-work.component';

describe('AssigningWorkComponent', () => {
  let component: AssigningWorkComponent;
  let fixture: ComponentFixture<AssigningWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AssigningWorkComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(AssigningWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

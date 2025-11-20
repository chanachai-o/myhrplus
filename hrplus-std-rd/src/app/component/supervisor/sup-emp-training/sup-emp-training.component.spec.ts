import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupEmpTrainingComponent } from './sup-emp-training.component';

describe('SupEmpTrainingComponent', () => {
  let component: SupEmpTrainingComponent;
  let fixture: ComponentFixture<SupEmpTrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SupEmpTrainingComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupEmpTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupEmpListComponent } from './sup-emp-list.component';

describe('SupEmpListComponent', () => {
  let component: SupEmpListComponent;
  let fixture: ComponentFixture<SupEmpListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SupEmpListComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupEmpListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

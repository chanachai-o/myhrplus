import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpOnlineComponent } from './emp-online.component';

describe('EmpOnlineComponent', () => {
  let component: EmpOnlineComponent;
  let fixture: ComponentFixture<EmpOnlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [EmpOnlineComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

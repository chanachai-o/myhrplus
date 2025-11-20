import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyhrCenterBoxComponent } from './myhr-center-box.component';

describe('MyhrCenterBoxComponent', () => {
  let component: MyhrCenterBoxComponent;
  let fixture: ComponentFixture<MyhrCenterBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MyhrCenterBoxComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyhrCenterBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

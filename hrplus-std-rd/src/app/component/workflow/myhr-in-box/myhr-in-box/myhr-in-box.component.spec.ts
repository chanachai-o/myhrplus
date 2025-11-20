import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyhrInBoxComponent } from './myhr-in-box.component';

describe('MyhrInBoxComponent', () => {
  let component: MyhrInBoxComponent;
  let fixture: ComponentFixture<MyhrInBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MyhrInBoxComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyhrInBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

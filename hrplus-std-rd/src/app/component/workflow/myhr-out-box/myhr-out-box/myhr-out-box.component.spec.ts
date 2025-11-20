import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyhrOutBoxComponent } from './myhr-out-box.component';

describe('MyhrOutBoxComponent', () => {
  let component: MyhrOutBoxComponent;
  let fixture: ComponentFixture<MyhrOutBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MyhrOutBoxComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyhrOutBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

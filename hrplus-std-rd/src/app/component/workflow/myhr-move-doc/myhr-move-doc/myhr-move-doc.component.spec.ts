import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyhrMoveDocComponent } from './myhr-move-doc.component';

describe('MyhrMoveDocComponent', () => {
  let component: MyhrMoveDocComponent;
  let fixture: ComponentFixture<MyhrMoveDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MyhrMoveDocComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyhrMoveDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

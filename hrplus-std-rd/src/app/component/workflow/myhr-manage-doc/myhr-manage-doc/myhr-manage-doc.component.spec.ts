import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyhrManageDocComponent } from './myhr-manage-doc.component';

describe('MyhrManageDocComponent', () => {
  let component: MyhrManageDocComponent;
  let fixture: ComponentFixture<MyhrManageDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MyhrManageDocComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyhrManageDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

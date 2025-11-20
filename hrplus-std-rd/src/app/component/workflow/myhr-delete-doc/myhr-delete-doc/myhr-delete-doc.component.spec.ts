import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyhrDeleteDocComponent } from './myhr-delete-doc.component';

describe('MyhrDeleteDocComponent', () => {
  let component: MyhrDeleteDocComponent;
  let fixture: ComponentFixture<MyhrDeleteDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MyhrDeleteDocComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyhrDeleteDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

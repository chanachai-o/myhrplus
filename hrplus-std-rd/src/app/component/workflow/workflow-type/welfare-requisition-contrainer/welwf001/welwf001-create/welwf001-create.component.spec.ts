import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Welwf001CreateComponent } from './welwf001-create.component';

describe('Welwf001CreateComponent', () => {
  let component: Welwf001CreateComponent;
  let fixture: ComponentFixture<Welwf001CreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Welwf001CreateComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Welwf001CreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApsAbilityListTkcComponent } from './aps-ability-list-tkc.component';

describe('ApsAbilityListTkcComponent', () => {
  let component: ApsAbilityListTkcComponent;
  let fixture: ComponentFixture<ApsAbilityListTkcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ApsAbilityListTkcComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApsAbilityListTkcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareWorkComponent } from './share-work.component';

describe('ShareWorkComponent', () => {
  let component: ShareWorkComponent;
  let fixture: ComponentFixture<ShareWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ShareWorkComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(ShareWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

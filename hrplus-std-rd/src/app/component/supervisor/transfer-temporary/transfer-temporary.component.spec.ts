import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferTemporaryComponent } from './transfer-temporary.component';

describe('TransferTemporaryComponent', () => {
  let component: TransferTemporaryComponent;
  let fixture: ComponentFixture<TransferTemporaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TransferTemporaryComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferTemporaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

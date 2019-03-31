import { async, TestBed } from '@angular/core/testing';
import { UiMatHeaderModule } from './ui-mat-header.module';

describe('UiMatHeaderModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiMatHeaderModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(UiMatHeaderModule).toBeDefined();
  });
});

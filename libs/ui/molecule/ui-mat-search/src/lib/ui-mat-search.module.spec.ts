import { async, TestBed } from '@angular/core/testing';
import { UiMatSearchModule } from './ui-mat-search.module';

describe('UiMatSearchModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiMatSearchModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(UiMatSearchModule).toBeDefined();
  });
});

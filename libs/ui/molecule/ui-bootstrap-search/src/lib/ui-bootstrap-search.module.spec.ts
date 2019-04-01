import { async, TestBed } from '@angular/core/testing';
import { UiBootstrapSearchModule } from './ui-bootstrap-search.module';

describe('UiBootstrapSearchModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiBootstrapSearchModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(UiBootstrapSearchModule).toBeDefined();
  });
});

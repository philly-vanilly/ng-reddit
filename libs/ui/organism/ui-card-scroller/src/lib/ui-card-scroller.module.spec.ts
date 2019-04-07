import { async, TestBed } from '@angular/core/testing';
import { UiCardScrollerModule } from './ui-card-scroller.module';

describe('UiCardScrollerModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiCardScrollerModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(UiCardScrollerModule).toBeDefined();
  });
});

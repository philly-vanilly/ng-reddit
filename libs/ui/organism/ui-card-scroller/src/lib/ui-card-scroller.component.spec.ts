import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiCardScrollerComponent } from './ui-card-scroller.component';

describe('UiCardScrollerComponent', () => {
  let component: UiCardScrollerComponent;
  let fixture: ComponentFixture<UiCardScrollerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiCardScrollerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiCardScrollerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

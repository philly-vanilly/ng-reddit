import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiCardScrollerComponent } from './ui-card-scroller.component';
import { MockModule } from 'ng-mocks';
import { MatButtonModule, MatCardModule } from '@angular/material';
import { LayoutModule } from '@angular/cdk/layout';
import { ScrollingModule } from '@angular/cdk/scrolling';

describe('UiCardScrollerComponent', () => {
  let component: UiCardScrollerComponent;
  let fixture: ComponentFixture<UiCardScrollerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiCardScrollerComponent ],
      imports: [
        MockModule(MatButtonModule),
        MockModule(MatCardModule),
        MockModule(LayoutModule),
        MockModule(ScrollingModule)
      ]
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

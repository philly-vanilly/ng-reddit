import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiBootstrapSearchComponent } from './ui-bootstrap-search.component';

describe('UiBootstrapSearchComponent', () => {
  let component: UiBootstrapSearchComponent;
  let fixture: ComponentFixture<UiBootstrapSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiBootstrapSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiBootstrapSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiMatSearchComponent } from './ui-mat-search.component';

describe('UiMatSearchComponent', () => {
  let component: UiMatSearchComponent;
  let fixture: ComponentFixture<UiMatSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiMatSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiMatSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

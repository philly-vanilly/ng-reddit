import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiMatHeaderComponent } from './ui-mat-header.component';

describe('UiMatHeaderComponent', () => {
  let component: UiMatHeaderComponent;
  let fixture: ComponentFixture<UiMatHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiMatHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiMatHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

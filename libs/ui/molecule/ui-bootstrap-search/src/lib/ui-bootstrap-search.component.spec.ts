import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiBootstrapSearchComponent } from './ui-bootstrap-search.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatIconModule, MatInputModule } from '@angular/material';
import { MockModule } from 'ng-mocks';

describe('UiBootstrapSearchComponent', () => {
  let component: UiBootstrapSearchComponent;
  let fixture: ComponentFixture<UiBootstrapSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiBootstrapSearchComponent ],
      imports: [
        ReactiveFormsModule,
        MockModule(MatIconModule),
        MockModule(MatInputModule),
        MockModule(MatAutocompleteModule),
      ]
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

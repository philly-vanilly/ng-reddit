import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiMatSearchComponent } from './ui-mat-search.component';
import { MockModule } from 'ng-mocks';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatIconModule,
  MatInputModule
} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

describe('UiMatSearchComponent', () => {
  let component: UiMatSearchComponent;
  let fixture: ComponentFixture<UiMatSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UiMatSearchComponent
      ],
      imports: [
        ReactiveFormsModule,
        MockModule(MatIconModule),
        MockModule(MatButtonModule),
        MockModule( MatButtonToggleModule),
        MockModule(MatInputModule),
        MockModule(MatAutocompleteModule)
      ]
    }).compileComponents();
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

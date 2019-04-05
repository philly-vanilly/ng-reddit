import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiMatHeaderComponent } from './ui-mat-header.component';
import { MockComponent, MockModule } from 'ng-mocks';
import { UiBootstrapSearchComponent } from '@libs/ui/molecule/ui-bootstrap-search/src/lib/ui-bootstrap-search.component';
import { MatButtonModule, MatIconModule, MatToolbarModule } from '@angular/material';

describe('UiMatHeaderComponent', () => {
  let component: UiMatHeaderComponent;
  let fixture: ComponentFixture<UiMatHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UiMatHeaderComponent,
        MockComponent(UiBootstrapSearchComponent),
      ],
      imports: [
        MockModule(MatIconModule),
        MockModule(MatToolbarModule),
        MockModule(MatButtonModule),
      ]
    }).compileComponents();
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

import { async, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { ReadService } from '@web/src/app/read.service';
import { Router } from '@angular/router';
import { MockComponent, MockModule } from 'ng-mocks';
import { UiMatHeaderComponent } from '@libs/ui/organism/ui-mat-header/src/lib/ui-mat-header.component';

describe('AppComponent', () => {
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [
          AppComponent,
          MockComponent(UiMatHeaderComponent)
        ],
        providers: [
          {provide: ReadService, useValue: jest.fn()},
          {provide: Router, useValue: jest.fn()},
        ],
        imports: [
          RouterTestingModule, // needed for <router-outlet> (injected Router can be mocked)
          // HttpClientTestingModule,
          MockModule(NgxsModule.forRoot())
        ]
      }).compileComponents();
    })
  );
  it(
    'should create the app',
    async(() => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.debugElement.componentInstance;
      expect(app).toBeTruthy();
    })
  );
});

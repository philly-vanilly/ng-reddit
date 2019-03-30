import { async, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthConfig } from '@libs/auth/src/lib/auth-config';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxsModule } from '@ngxs/store';
import { AuthState } from '@libs/auth/src/lib/auth.store';
import { AuthService } from '@libs/auth/src';

describe('AppComponent', () => {
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [AppComponent],
        providers: [AuthService, AuthConfig],
        // TODO: check if this can be reduced with ng-mocks
        imports: [RouterTestingModule, HttpClientTestingModule, NgxsModule.forRoot([AuthState])]
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

import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AuthConfig } from '@libs/auth/src/lib/models/auth-config';
import { GestureConfig } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';
import { AuthModule, InitialAuthService } from '@libs/auth/src';
import { ReadService } from './read.service';
import { UiMatHeaderModule } from '@libs/ui/organism/ui-mat-header/src';
import { StoreModule } from '@web/src/app/store.module';
import { AppRoutingModule } from '@web/src/app/app-routing.module';

const authConfig: AuthConfig = {
  redditAuthURI: environment.redditAuthURI,
  redditAppAuthURI: environment.redditAppAuthURI,
  clientID: environment.clientID,
  redirectURI: environment.redirectURI,
  corsProxy: environment.corsProxy
};

// see https://www.intertech.com/Blog/angular-4-tutorial-run-code-during-app-initialization/
const handleInitialAuth = (initialAuthService: InitialAuthService): Function => {
  return () => initialAuthService.initAuth();
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    environment.useAnimations ? BrowserAnimationsModule : NoopAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    StoreModule,
    AuthModule.forRoot(),
    UiMatHeaderModule
  ],
  providers: [
    InitialAuthService,
    {
      provide: APP_INITIALIZER,
      useFactory: handleInitialAuth,
      deps: [InitialAuthService],
      multi: true
    },
    {
      provide: AuthConfig,
      useValue: authConfig
    },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: GestureConfig
    },
    ReadService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

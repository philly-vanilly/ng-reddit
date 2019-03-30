import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AuthConfig } from '@libs/auth/src/lib/auth-config';
import { GestureConfig, MatAutocompleteModule, MatIconModule, MatInputModule, MatToolbarModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsStoragePluginModule, StorageOption } from '@ngxs/storage-plugin';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from '../environments/environment';
import { AuthModule, InitialAuthService } from '@libs/auth/src';
import { ReadService } from './read.service';


const authConfig: AuthConfig = {
  redditAuthURI: environment.redditAuthURI,
  redditAppAuthURI: environment.redditAppAuthURI,
  clientID: environment.clientID,
  redirectURI: environment.redirectURI,
  corsProxy: environment.corsProxy
};

// see https://www.intertech.com/Blog/angular-4-tutorial-run-code-during-app-initialization/
const handleInitialAuth = (initialAuthService: InitialAuthService): Function => {
  return () => initialAuthService.initializeAuth();
};

const routes = [
  {
    path: 'r',
    loadChildren: './sub/sub.module#SubModule'
    // canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

const toolbarModules = [
  ReactiveFormsModule,
  MatToolbarModule,
  MatIconModule,
  MatInputModule,
  MatAutocompleteModule
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    environment.useAnimations ? BrowserAnimationsModule : NoopAnimationsModule,
    HttpClientModule,
    ...toolbarModules,
    ReactiveFormsModule,
    RouterModule.forRoot(
      routes,
      {
        initialNavigation: 'enabled', // https://angular.io/api/router/ExtraOptions#initialNavigation
        preloadingStrategy: PreloadAllModules,
        useHash: false,
        enableTracing: false,
        // the following keys are for using hash-fragment-scrolling with angular router
        onSameUrlNavigation: 'reload', // this allows anchor-scrolling within the same page
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
        scrollOffset: [0, 0] // [x, y]
      }
    ),
    NgxsStoragePluginModule.forRoot({
      key: ['auth'], // string or array of strings that can be deeply nested via dot notation
      storage: StorageOption.SessionStorage
    }),
    NgxsModule.forRoot([], {
      developmentMode: !environment.production
    }),
    NgxsRouterPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot({
      maxAge: 100,
      name: environment.appName,
      disabled: environment.production
    }),
    NgxsLoggerPluginModule.forRoot({
      disabled: environment.production,
      collapsed: true,
      logger: console
    }),
    AuthModule.forRoot()
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

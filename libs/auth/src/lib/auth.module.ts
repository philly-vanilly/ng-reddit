import { ModuleWithProviders, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthState } from './auth.store';
import { TokenInterceptor } from './token.interceptor';
import { CorsInterceptor } from './cors.interceptor';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { NgxsModule } from '@ngxs/store';

@NgModule({
  imports: [
    NgxsModule.forFeature([
      AuthState
    ])
  ]
})
export class AuthModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AuthModule,
      providers: [
        // interceptors executed in order
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: CorsInterceptor,
          multi: true
        },
        AuthService,
        AuthGuard
      ]
    };
  }
}

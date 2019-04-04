import { Action, Selector, State, StateContext } from '@ngxs/store';
import { AuthService } from './auth.service';
import {
  AppActivateRefreshTimeout,
  AppLoginCall,
  AppLoginSuccess,
  UserClear,
  UserLoginCall,
  UserLoginFailure,
  UserLoginSuccess
} from './auth.actions';

export interface AuthUserStateModel {
  accessToken: string;
  expiration: string;
}

export interface AuthAppStateModel {
  accessToken: string;
  expiration: string;
  deviceId: string;
}

export interface AuthStateModel {
  user?: AuthUserStateModel;
  app?: AuthAppStateModel;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {}
})
export class AuthState {
  private activeTimeout;

  constructor(
    private authService: AuthService
  ) {}

  @Action(UserLoginCall) userLoginCall() {
    this.authService.loginUser();
  }

  @Action(UserLoginSuccess) userLoginSuccess(ctx: StateContext<AuthStateModel>, { payload }): void {
    ctx.patchState({ user: { accessToken: payload.accessToken, expiration: payload.expiration } });
  }

  @Action(UserLoginFailure) userLoginFailure(ctx: StateContext<AuthStateModel>, errorMessage: string): void {
    console.warn(errorMessage);
  }

  @Action(UserClear) userClear(ctx: StateContext<AuthStateModel>): void {
    ctx.patchState({ user: undefined });
  }

  @Action(AppLoginCall) appLoginCall(ctx: StateContext<AuthStateModel>): void {
    this.authService.loginApp();
  }

  @Action(AppLoginSuccess) appLoginSuccess(ctx: StateContext<AuthStateModel>, { payload }: AppLoginSuccess): void {
    const expiration: Date = new Date();
    expiration.setSeconds(expiration.getSeconds() + payload.expires_in);
    ctx.patchState({
      app: { accessToken: payload.access_token, expiration: expiration.toJSON(), deviceId: payload.device_id }
    });
    ctx.dispatch(new AppActivateRefreshTimeout());
  }

  @Action(AppActivateRefreshTimeout) appActivateRefreshTimeout(ctx: StateContext<AuthStateModel>): void {
    if (this.activeTimeout) {
      clearTimeout(this.activeTimeout);
    }
    const expirationDate: Date = new Date(ctx.getState().app.expiration);
    const timeToWait: number = expirationDate.getTime() - new Date().getTime() - 120000; // 2 min
    this.activeTimeout = setTimeout(() => ctx.dispatch(new AppLoginCall()), timeToWait);
  }
}

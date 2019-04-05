import { Action, Selector, State, StateContext } from '@ngxs/store';
import { AuthService } from './auth.service';
import {
  AppActivateRefreshTimeout,
  AppNeedsToLoginCheck,
  AppLoginSuccess,
  UserClear,
  UserLoginCall,
  UserLoginFailure,
  UserLoginSuccess
} from './auth.actions';
import { getDateWithSecondsOffset, isTokenValid } from '@libs/auth/src/lib/auth-utility';

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

  @Selector() static isUserTokenValid(state: AuthStateModel): boolean {
    return isTokenValid(state.user);
  }

  @Selector() static isAppTokenValid(state: AuthStateModel): boolean {
    return isTokenValid(state.app);
  }


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

  @Action(AppNeedsToLoginCheck) appNeedsToLoginCheck(ctx: StateContext<AuthStateModel>): void {
    const appState: AuthAppStateModel = ctx.getState().app;
    if (!isTokenValid(appState)) {
      this.authService.loginApp();
    }
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
    this.activeTimeout = setTimeout(() => ctx.dispatch(new AppNeedsToLoginCheck()), timeToWait);
  }
}

import { Action, Selector, State, StateContext } from '@ngxs/store';
import { AuthService } from './auth.service';
import {
  AppActivateRefreshTimeout,
  AppLoginSuccess,
  AppNeedsToLoginCheck,
  UserClear,
  UserLoginCall,
  UserLoginFailure,
  UserLoginSuccess
} from './auth.actions';
import { getDateWithSecondsOffset, isTokenStillValidInSeconds } from '@libs/auth/src/lib/auth-utility';
import { AuthAppStateModel, AuthStateModel } from '@libs/auth/src/lib/models/store-models';

@State<AuthStateModel>({
  name: 'auth',
  defaults: {}
})
export class AuthState {
  private activeTimeout;

  @Selector() static isUserTokenValid(state: AuthStateModel): boolean {
    return isTokenStillValidInSeconds(state.user, 30);
  }

  @Selector() static isAppTokenValid(state: AuthStateModel): boolean {
    return isTokenStillValidInSeconds(state.app, 30);
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
    if (!isTokenStillValidInSeconds(appState, 1200)) { // 20 min
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
    // refresh 2 min before expiration
    const expirationDate: Date = new Date(ctx.getState().app.expiration);
    const msToWait: number = expirationDate.getTime() - getDateWithSecondsOffset(-120).getTime();
    this.activeTimeout = setTimeout(() => ctx.dispatch(new AppNeedsToLoginCheck()), msToWait);
  }
}

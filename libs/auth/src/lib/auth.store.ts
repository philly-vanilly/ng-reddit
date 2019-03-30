import { Action, Selector, State, StateContext } from '@ngxs/store';
import { AuthService } from './auth.service';
import { AppActivateRefreshTimeout, AppLoginCall, AppLoginSuccess, UserClear, UserLoadFromStorage, UserLoginFailure, UserLoginSuccess } from './auth.actions';

export interface AuthStateModel {
  user?: {
    accessToken: string;
    expiration: Date;
  };
  app?: {
    accessToken: string;
    expiration: Date;
    deviceId: string;
  };
}

const doesTokenExistAndIsNotExpired = (token: string, expiration: Date): boolean => {
  return token && expiration && expiration > new Date();
};

@State<AuthStateModel>({
  name: 'auth',
  defaults: {}
})
export class AuthState {
  private activeTimeout;

  @Selector() static isUserTokenValid(state: AuthStateModel): boolean {
    return state.user && doesTokenExistAndIsNotExpired(state.user.accessToken, state.user.expiration);
  }

  @Selector() static isAppTokenValid(state: AuthStateModel): boolean {
    return !!state.app && doesTokenExistAndIsNotExpired(state.app.accessToken, state.app.expiration);
  }


  constructor(
    private authService: AuthService
  ) {}

  @Action(UserLoadFromStorage) userLoadFromStorage(ctx: StateContext<AuthStateModel>): void {
    const accessToken: string = sessionStorage.getItem('login_success_access_token');
    const loginSuccessActionTokenExpiration: string = sessionStorage.getItem('login_success_access_token_expiration');

    sessionStorage.removeItem('login_success_access_token');
    sessionStorage.removeItem('login_success_access_token_expiration');

    if (accessToken && loginSuccessActionTokenExpiration) {
      ctx.patchState({
        user: { accessToken, expiration: new Date(loginSuccessActionTokenExpiration) }
      });
      ctx.dispatch(new UserLoginSuccess());
    } else {
      ctx.dispatch(new UserLoginFailure());
    }
  }

  @Action(UserLoginSuccess) userLoginSuccess(ctx: StateContext<AuthStateModel>): void {
  }

  @Action(UserLoginFailure) userLoginFailure(ctx: StateContext<AuthStateModel>): void {
  }

  @Action(UserClear) userClear(ctx: StateContext<AuthStateModel>): void {
    ctx.patchState({
      user: undefined
    });
  }

  @Action(AppLoginCall) appLoginCall(ctx: StateContext<AuthStateModel>): void {
    this.authService.loginApp();
  }

  @Action(AppLoginSuccess) appLoginSuccess(ctx: StateContext<AuthStateModel>, { payload }: AppLoginSuccess): void {
    const expiration: Date = new Date();
    expiration.setSeconds(expiration.getSeconds() + payload.expires_in);
    ctx.patchState({
      app: { accessToken: payload.access_token, expiration, deviceId: payload.device_id }
    });
    ctx.dispatch(new AppActivateRefreshTimeout());
  }

  @Action(AppActivateRefreshTimeout) appActivateRefreshTimeout(ctx: StateContext<AuthStateModel>): void {
    if (this.activeTimeout) {
      clearTimeout(this.activeTimeout);
    }
    const expirationDate: Date = ctx.getState().app.expiration;
    const timeToWait: number = expirationDate.getTime() - new Date().getTime() - 120000; // 2 min
    this.activeTimeout = setTimeout(() => ctx.dispatch(new AppLoginCall()), timeToWait);
  }
}

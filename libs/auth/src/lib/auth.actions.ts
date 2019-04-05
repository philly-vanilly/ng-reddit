import { AppLoginResponse } from './models/reddit-login-responses';
import { type } from '@libs/utils/src';
import { AuthUserStateModel } from '@libs/auth/src';

export class UserLoginCall {
  static readonly type = type('[Auth] UserLoginCall');
}


export class UserLoadFromStorage {
  static readonly type = type('[Auth] UserLoadFromStorage');
  constructor(public payload: any) {}
}

export class UserLoginSuccess {
  static readonly type = type('[Auth] UserLoginSuccess');
  constructor(public payload: AuthUserStateModel) {}
}

export class UserLoginFailure {
  static readonly type = type('[Auth] UserLoginFailure');
  constructor(public payload: string) {}
}

export class UserClear {
  static readonly type = type('[Auth] UserClear');
}

export class AppNeedsToLoginCheck {
  static readonly type = type('[Auth] AppNeedsToLoginCheck');
}

export class AppLoginSuccess {
  static readonly type = type('[Auth] AppLoginSuccess');

  constructor(public payload: AppLoginResponse) {}
}

export class AppActivateRefreshTimeout {
  static readonly type = type('[Auth] AppActivateRefreshTimeout');
}

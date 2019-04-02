import { AppLoginResponse } from './app-login-response.model';
import { type } from '@libs/utils/src';

export class UserLoginCall {
  static readonly type = type('[Auth] UserLoginCall');
}


export class UserLoadFromStorage {
  static readonly type = type('[Auth] UserLoadFromStorage');
}

export class UserLoginSuccess {
  static readonly type = type('[Auth] UserLoginSuccess');
}

export class UserLoginFailure {
  static readonly type = type('[Auth] UserLoginFailure');
}

export class UserClear {
  static readonly type = type('[Auth] UserClear');
}

export class AppLoginCall {
  static readonly type = type('[Auth] AppLoginCall');
}

export class AppLoginSuccess {
  static readonly type = type('[Auth] AppLoginSuccess');

  // {"access_token":"-53uGkwPRVy3qiSXpUOGQurUOLJs","token_type":"bearer","device_id":"DO_NOT_TRACK_THIS_DEVICE","expires_in":3600,"scope":"*"}
  constructor(public payload: AppLoginResponse) {
  }
}

export class AppActivateRefreshTimeout {
  static readonly type = type('[Auth] AppActivateRefreshTimeout');
}

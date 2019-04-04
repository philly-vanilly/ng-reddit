import { Injectable, Injector } from '@angular/core';
import { Store } from '@ngxs/store';
import { UserLoginFailure, UserLoginSuccess } from './auth.actions';
import { LOGIN_PRECEDING_LOCATION, LOGIN_ATTEMPT_STATE } from './auth.storage-keys';
import { Router, UrlTree } from '@angular/router';
import { getDateWithSecondsOffset } from '@libs/auth/src/lib/auth-utility';

class UserAuthData {
  access_token?: string;
  token_type?: string;
  state?: string;
  expires_in?: string;
  scope?: string;
}

@Injectable()
export class InitialAuthService {
  constructor(
    private store: Store,
    private injector: Injector // needed to get Router before app initialization: https://github.com/robisim74/angular-l10n/issues/176
  ) {}

  async initAuth(): Promise<any> {
    return new Promise((resolveFn, rejectFn) => {
      this.handlePossibleUserRedirect();
      this.getOrUpdateAppToken();
      resolveFn();
    });
  }

  private getOrUpdateAppToken() {
    // if app-token does not exist or (almost) expired, dispatch
    // this.store.dispatch(new AppLoginCall());
    // otherwise just dispatch a Refresh-Update
  }

  private handlePossibleUserRedirect() {
    const {savedState, urlTreeSerialized} = getPreUserLoginDataFromStorage();
    const hashData: string = window.location.hash;
    if (this.doesDataForUserLoginExistAndIsItStillValid(savedState, hashData)) {
      const authData: UserAuthData = hashDataToKeyValuePairs(hashData);
      if (this.isAuthDataCompleteAndStateValid(authData, savedState)) {
        this.navigateToPreLoginLocation(urlTreeSerialized);
        this.store.dispatch(new UserLoginSuccess({
          accessToken: authData.access_token,
          expiration: getExpirationDateFromAuthData(authData.state, authData.expires_in).toJSON()
        }));
      }
    }
  }

  private doesDataForUserLoginExistAndIsItStillValid(savedState: string, hashData: string): boolean {
    if (savedState && hashData && hashData.length > 1) { // > 1 because the char # is also included
      const requestExpiration = new Date(atob(savedState));
      getDateWithSecondsOffset(3600, requestExpiration);
      requestExpiration.setMinutes(requestExpiration.getMinutes() + 60);
      if (requestExpiration > new Date()) {
        return true;
      } else {
        this.store.dispatch(new UserLoginFailure(`Request expired at: ${requestExpiration.toLocaleDateString()}`));
      }
    }
    return false;
  };

  private isAuthDataCompleteAndStateValid(authData: UserAuthData, savedState: string): boolean {
    if (Object.keys(UserAuthData).every(key => authData[key]) && savedState && authData.state === savedState) {
      return true;
    } else {
      this.store.dispatch(new UserLoginFailure(`Login data not valid: ${JSON.stringify(authData)}`));
      return false;
    }
  };

  private navigateToPreLoginLocation(urlTreeSerialized?: string): void {
    if (urlTreeSerialized) {
      const router: Router = this.injector.get(Router);
      const urlTree: UrlTree = router.parseUrl(urlTreeSerialized);
      router.navigateByUrl(urlTree);
    } else {
      history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  }
}

const getPreUserLoginDataFromStorage = (): {savedState: string, urlTreeSerialized: string} => {
  const savedState: string = sessionStorage.getItem(LOGIN_ATTEMPT_STATE);
  sessionStorage.removeItem(LOGIN_ATTEMPT_STATE);
  const urlTreeSerialized: string = sessionStorage.getItem(LOGIN_PRECEDING_LOCATION);
  sessionStorage.removeItem(LOGIN_ATTEMPT_STATE);
  return {savedState, urlTreeSerialized};
};

export const hashDataToKeyValuePairs = (hashData: string): UserAuthData => {
  const hashDataWithoutHash = hashData.replace(/#/g, '');
  const result = {};
  hashDataWithoutHash.split('&').forEach(pairString => {
    const keyValuePair: string[] = pairString.split('=');
    if (keyValuePair.length === 2) {
      result[keyValuePair[0]] = keyValuePair[1];
    }
  });
  return result;
};

export const getExpirationDateFromAuthData = (state: string | undefined, expires_in: string | undefined): Date => {
  const expiration: Date = new Date(atob(state));
  if (isNaN(expiration.getSeconds())) {
    throw new Error(`state does not contain a valid date. state = ${atob(state)}`);
  }
  const expiresInNumber: number = Number(expires_in);
  if (isNaN(expiresInNumber) || expiresInNumber <= 0) {
    throw new Error(`expires_in is not a valid number. expires_in = ${expires_in}`);
  }
  return getDateWithSecondsOffset(expiresInNumber, expiration);
};

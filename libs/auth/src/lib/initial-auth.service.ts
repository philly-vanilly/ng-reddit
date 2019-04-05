import { Injectable, Injector } from '@angular/core';
import { Store } from '@ngxs/store';
import { UserLoginFailure, UserLoginSuccess } from './auth.actions';
import { LOGIN_PRECEDING_LOCATION, LOGIN_ATTEMPT_STATE } from './auth.storage-keys';
import { Router, UrlTree } from '@angular/router';
import { getDateWithSecondsOffset } from '@libs/auth/src/lib/auth-utility';

export interface RedirectHashAuthData {
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
    const {savedState, urlTreeSerialized} = getPreUserLoginDataFromStorage(LOGIN_ATTEMPT_STATE, LOGIN_PRECEDING_LOCATION);
    const hashData: string = window.location.hash;
    if (!requestIsALoginRedirect(savedState, hashData)) {
      return;
    }

    const dateFromState: Date = new Date(atob(savedState));
    const requestExpiration: Date = getDateWithSecondsOffset(3600, dateFromState);
    if (requestExpiration <= new Date()) {
      this.store.dispatch(new UserLoginFailure(`Request expired at: ${requestExpiration.toLocaleDateString()}`));
      return;
    }

    const authData: RedirectHashAuthData = hashDataToKeyValuePairs(hashData);
    if (!authData && authData.state !== savedState) {
      this.store.dispatch(new UserLoginFailure(`Login data not valid: ${JSON.stringify(authData)}`));
      return;
    }

    // all checks passed...
    this.navigateToPreLoginLocation(urlTreeSerialized);
    this.store.dispatch(new UserLoginSuccess({
      accessToken: authData.access_token,
      expiration: getExpirationDateFromAuthData(authData.state, authData.expires_in).toJSON()
    }));
  }

  private navigateToPreLoginLocation(urlTreeSerialized?: string): void {
    const fallBack = () => history.pushState('', document.title, window.location.pathname + window.location.search);
    if (urlTreeSerialized) {
      const router: Router = this.injector.get(Router);
      const urlTree: UrlTree = router.parseUrl(urlTreeSerialized);
      router.navigateByUrl(urlTree).catch(e => fallBack());
    } else {
      fallBack();
    }
  }
}

export const requestIsALoginRedirect = (savedState,  hashData): boolean =>
  savedState && hashData && hashData.length > 1; // > 1 because the char # is also included

export const getPreUserLoginDataFromStorage = (loginAttemptStateToken: string, loginPrecedingLocationToken):
  {savedState: string, urlTreeSerialized: string} => {
  const savedState: string = sessionStorage.getItem(loginAttemptStateToken);
  sessionStorage.removeItem(loginAttemptStateToken);
  const urlTreeSerialized: string = sessionStorage.getItem(loginPrecedingLocationToken);
  sessionStorage.removeItem(loginPrecedingLocationToken);
  return {savedState, urlTreeSerialized};
};

export const hashDataToKeyValuePairs = (hashData: string): RedirectHashAuthData | undefined => {
  const hashDataWithoutHash = hashData.replace(/#/g, '');
  const result = {};
  hashDataWithoutHash.split('&').forEach(pairString => {
    const keyValuePair: string[] = pairString.split('=');
    if (keyValuePair.length === 2) {
      result[keyValuePair[0]] = keyValuePair[1];
    }
  });
  const requiredProps = ['access_token', 'token_type', 'state', 'expires_in', 'scope'];
  return requiredProps.every(key => result[key]) && Object.keys(result).every(key => requiredProps.includes(key)) ? result : undefined;
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

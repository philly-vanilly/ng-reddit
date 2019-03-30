import { Injectable, Injector } from '@angular/core';
import { Store } from '@ngxs/store';
import { AppLoginCall, UserLoadFromStorage } from './auth.actions';
import { LOGIN_PRECEDING_LOCATION, LOGIN_ATTEMPT_STATE } from './auth.storage-keys';
import { Router, UrlTree } from '@angular/router';

class UserAuthData {
  access_token?: string;
  token_type?: string;
  state?: string;
  expires_in?: string;
  scope?: string;
}

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

export const isAuthDataIsCompleteAndStateValid = (authData: UserAuthData, savedState: string): boolean => {
  return Object.keys(UserAuthData).every(key => authData[key]) && savedState && authData.state === savedState;
};

@Injectable()
export class InitialAuthService {
  constructor(
    private store: Store,
    private injector: Injector // needed to get Router before app initialization: https://github.com/robisim74/angular-l10n/issues/176
  ) {}

  async initializeAuth(): Promise<any> {
    return new Promise((resolveFn, rejectFn) => {
      const savedState: string = sessionStorage.getItem(LOGIN_ATTEMPT_STATE);
      sessionStorage.removeItem(LOGIN_ATTEMPT_STATE);
      const urlTreeSerialized: string = sessionStorage.getItem(LOGIN_PRECEDING_LOCATION);

      const hashData: string = window.location.hash; // includes the # character itself
      if (hashData || hashData.length > 1) {
        const authData: UserAuthData = hashDataToKeyValuePairs(hashData);
        const requestExpiration = new Date(atob(savedState));
        requestExpiration.setMinutes(requestExpiration.getMinutes() + 60);
        if (requestExpiration < new Date()) {
          console.warn(`Request expired at: ${requestExpiration.toLocaleDateString()}`);
        } else if (isAuthDataIsCompleteAndStateValid(authData, savedState)) {
          sessionStorage.setItem('login_success_access_token', authData.access_token);
          const expirationDate = new Date(atob(authData.state));
          expirationDate.setSeconds(expirationDate.getSeconds() + Number(authData.expires_in));
          sessionStorage.setItem('login_success_access_token_expiration', expirationDate.toJSON());
          this.removeHashFromUrl(urlTreeSerialized);
          this.store.dispatch(new UserLoadFromStorage());
        } else {
          console.warn(`Login data not valid: ${JSON.stringify(authData)}`);
        }
      }
      this.store.dispatch(new AppLoginCall());
      resolveFn();
    });
  }

  private removeHashFromUrl(urlTreeSerialized?: string): void {
    if (urlTreeSerialized) {
      const router: Router = this.injector.get(Router);
      const urlTree: UrlTree = router.parseUrl(urlTreeSerialized);
      router.navigateByUrl(urlTree);
    } else {
      history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  }
}

import { Injectable, Injector } from '@angular/core';
import { Store } from '@ngxs/store';
import { AppNeedsToLoginCheck, UserLoginFailure, UserLoginSuccess } from '@libs/auth/src/lib/auth.actions';
import { LOGIN_ATTEMPT_STATE, LOGIN_PRECEDING_LOCATION } from '@libs/auth/src/lib/auth.storage-keys';
import { Router, UrlTree } from '@angular/router';
import { getDateWithSecondsOffset } from '@libs/auth/src/lib/auth-utility';
import {
  getAndDeleteTokenFromStorage,
  getExpirationDateFromAuthData,
  hashDataToKeyValuePairs,
  requestIsALoginRedirect
} from '@libs/auth/src/lib/initial-auth/initial-auth-helpers';
import { UserLoginRedirectData } from '@libs/auth/src/lib/models/reddit-login-responses';

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
    this.store.dispatch(new AppNeedsToLoginCheck());
  }

  private handlePossibleUserRedirect() {
    const savedState: string = getAndDeleteTokenFromStorage(LOGIN_ATTEMPT_STATE);
    const urlTreeSerialized: string = getAndDeleteTokenFromStorage(LOGIN_PRECEDING_LOCATION);
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

    const authData: UserLoginRedirectData = hashDataToKeyValuePairs(hashData);
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

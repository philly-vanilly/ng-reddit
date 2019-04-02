import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthConfig } from './auth-config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { AppLoginResponse } from './app-login-response.model';
import { AppLoginSuccess, UserClear } from './auth.actions';
import { LOGIN_PRECEDING_LOCATION, LOGIN_ATTEMPT_STATE } from './auth.storage-keys';
import { incrementalHttpRetry } from '@libs/utils/src';

@Injectable()
export class AuthService {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authConfig: AuthConfig,
    private http: HttpClient,
    private store: Store
  ) {}

  loginUser(): void {
    const state = btoa(new Date().toJSON());
    const scope = 'read';
    const urlTree = this.router.createUrlTree([]);
    sessionStorage.setItem(LOGIN_PRECEDING_LOCATION, this.router.serializeUrl(urlTree));
    sessionStorage.setItem(LOGIN_ATTEMPT_STATE, state);
    location.href = `${this.authConfig.redditAuthURI}?` +
      `response_type=token` +
      `&client_id=${this.authConfig.clientID}` +
      `&state=${state}` +
      `&redirect_uri=${this.authConfig.redirectURI}` +
      `&scope=${scope}`;
    // redirect back to the app is handled on app-initialization
  }

  loginApp(): void {
    const formData = new FormData();
    formData.append('grant_type', 'https://oauth.reddit.com/grants/installed_client');
    formData.append('device_id', 'DO_NOT_TRACK_THIS_DEVICE');
    const headers = new HttpHeaders({
      'enctype': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${btoa(`${this.authConfig.clientID}:`)}`
    });
    this.http.post<AppLoginResponse>(
      this.authConfig.redditAppAuthURI,
      formData,
      { headers }).pipe(incrementalHttpRetry(500, 5))
      .subscribe((res: AppLoginResponse) => this.store.dispatch(new AppLoginSuccess(res))
    );
  }
}

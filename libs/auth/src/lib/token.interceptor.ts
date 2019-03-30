import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { AuthStateModel, AuthState } from './auth.store';
import { AppLoginCall } from './auth.actions';
import { filter } from 'rxjs/internal/operators/filter';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  @Select(AuthState.isUserTokenValid) private isUserTokenValid$: Observable<boolean>;
  private isUserTokenValid: boolean;
  @Select(AuthState.isAppTokenValid) private isAppTokenValid$: Observable<boolean>;
  private isAppTokenValid: boolean;

  private static makeModifiedRequest(req: HttpRequest<any>, next: HttpHandler, token: string): Observable<HttpEvent<any>>  {
    const modifiedReq: HttpRequest<any> = req.clone({
      headers: req.headers.set('Authorization', `bearer ${token}`)
    });
    return next.handle(modifiedReq);
  }

  constructor(private store: Store) {
    this.isUserTokenValid$.subscribe(isValid => this.isUserTokenValid = isValid);
    this.isAppTokenValid$.subscribe(isValid => this.isAppTokenValid = isValid);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.startsWith('https://oauth.reddit.com')) {
      if (this.isAppTokenValid) {
        const appToken: string = this.store.selectSnapshot<string>(state => (state.auth as AuthStateModel).app.accessToken);
        return TokenInterceptor.makeModifiedRequest(req, next, appToken);
      } else {
        this.isUserTokenValid$.pipe(filter(isValid => isValid)).subscribe(() => {
          const appToken: string = this.store.selectSnapshot<string>(state => (state.auth as AuthStateModel).app.accessToken);
          return TokenInterceptor.makeModifiedRequest(req, next, appToken);
        });
        this.store.dispatch(new AppLoginCall());
        return EMPTY;
      }
    }

    return next.handle(req);
  }
}

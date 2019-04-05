import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { AuthStateModel, AuthState, AuthAppStateModel } from './auth.store';
import { AppNeedsToLoginCheck } from './auth.actions';
import { filter } from 'rxjs/internal/operators/filter';
import { isTokenValid } from '@libs/auth/src/lib/auth-utility';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private store: Store) {}


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.startsWith('https://oauth.reddit.com')) {
      const authAppStateModel: AuthAppStateModel = this.store.selectSnapshot<AuthAppStateModel>(state => state.auth.app);
      if (isTokenValid(authAppStateModel)) {
        return makeModifiedRequest(req, next, authAppStateModel.accessToken);
      } else {
        this.store.dispatch(new AppNeedsToLoginCheck());
        return EMPTY;
      }
    }
    return next.handle(req);
  }
}

const makeModifiedRequest = (req: HttpRequest<any>, next: HttpHandler, token: string): Observable<HttpEvent<any>> => {
  const modifiedReq: HttpRequest<any> = req.clone({
    headers: req.headers.set('Authorization', `bearer ${token}`)
  });
  return next.handle(modifiedReq);
};

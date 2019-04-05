import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthConfig } from './models/auth-config';

@Injectable()
export class CorsInterceptor implements HttpInterceptor {
  constructor(private authConfig: AuthConfig) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.startsWith('https://oauth.reddit.com') ||  req.url.startsWith('https://ssl.reddit.com')) {
      const modifiedReq: HttpRequest<any> = req.clone({ url: `${this.authConfig.corsProxy}${req.url}` });
      return next.handle(modifiedReq);
    }
    return next.handle(req);
  }
}

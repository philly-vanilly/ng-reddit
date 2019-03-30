import { Component, OnDestroy } from '@angular/core';
import { combineLatest, Observable, Subject } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
;
import { Select, Store } from '@ngxs/store';
import { SubPostsGetCall, SubState } from './sub.store';
import { AuthState } from '@libs/auth/src/lib/auth.store';
import { filter } from 'rxjs/operators';
import { SubPost } from '@web/src/app/models/subreddit-listing.model';
import { ReadService } from '@web/src/app/read.service';

@Component({
  selector: 'web-sub',
  template: `
    <ng-container *ngIf="doPostsExist$ | async">
      <div *ngFor="let post of (posts$ | async)">{{ post.title }}</div>
    </ng-container>
  `,
  styles: [``]
})
export class SubComponent implements OnDestroy {
  @Select(state => state.sub.posts) posts$: Observable<SubPost[]>;
  @Select(SubState.doAnyExist) doPostsExist$: Observable<boolean>;
  @Select(AuthState.isAppTokenValid) private isAppTokenValid$: Observable<boolean>;
  destroy$ = new Subject();

  constructor(
    private router: Router,
    private readService: ReadService,
    private store: Store
  ) {
    combineLatest(
      this.router.events.pipe(filter(event => event instanceof NavigationEnd)),
      this.isAppTokenValid$.pipe(filter(isValid => isValid))
    ).subscribe((pair: any[]) => this.store.dispatch(new SubPostsGetCall(pair[0].url)));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}

import { Component, OnDestroy } from '@angular/core';
import { combineLatest, Observable, Subject } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { SubPostsGetCall, SubState } from './sub.store';
import { AuthState } from '@libs/auth/src/lib/auth.store';
import { filter, map } from 'rxjs/operators';
import { SubPost } from '@web/src/app/models/subreddit-listing.model';
import { ReadService } from '@web/src/app/read.service';
import { PostState } from '@web/src/app/post.store';

@Component({
  selector: 'web-sub',
  template: `
    <ng-container *ngIf="(count$ | async) > 0">
      <pre *ngFor="let post of (posts$ | async)">{{ post | json }}</pre>
    </ng-container>
  `,
  styles: [``]
})
export class SubComponent implements OnDestroy {
  @Select(PostState.size) count$: Observable<number>;
  @Select(PostState.entities) posts$: Observable<SubPost[]>;
  @Select(PostState.active) active$: Observable<SubPost>;
  @Select(PostState.activeId) activeId$: Observable<string>;
  @Select(PostState.keys) keys$: Observable<string[]>;
  @Select(PostState.loading) loading$: Observable<boolean>;
  @Select(PostState.error) error$: Observable<Error | undefined>;
  @Select(PostState.latestId) latestId$: Observable<string>;
  @Select(PostState.latest) latest$: Observable<SubPost>;


  @Select(AuthState.isAppTokenValid) private isAppTokenValid$: Observable<boolean>;
  destroy$ = new Subject();

  constructor(
    private router: Router,
    private readService: ReadService,
    private store: Store
  ) {
    combineLatest(this.router.events, this.isAppTokenValid$)
      .pipe(filter(([event, isValid]) => event instanceof NavigationEnd && isValid))
      .subscribe((pair: any[]) => {
        console.log("TRIGGER!");
        this.store.dispatch(new SubPostsGetCall(pair[0].url));
      }
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}

import { ChangeDetectionStrategy, Component, Inject, OnDestroy } from '@angular/core';
import { combineLatest, Observable, Subject } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Sub, SubPostsGetCall, SubState } from '@web/src/app/sub/sub.store';
import { AuthState } from '@libs/auth/src/lib/auth.store';
import { filter, map, takeUntil } from 'rxjs/operators';
import { ReadService } from '@web/src/app/read.service';
import { tap } from 'rxjs/internal/operators/tap';
import { HEADER_HEIGHT } from '@web/src/app/app.injection-tokens';

@Component({
  selector: 'web-sub',
  template: `
    <ng-container *ngIf="subName">
      <ui-card-scroller
        [sub$]="subs$ | activeSub : subName"
        [offsetTop]="headerHeight"
        (scrollEndReached)="fetchPostsIfNeeded()"
      ></ui-card-scroller>
    </ng-container>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubComponent implements OnDestroy {
  @Select(SubState.entities) subs$: Observable<Sub[]>;
  @Select(AuthState.isAppTokenValid) private isAppTokenValid$: Observable<boolean>;

  subName: string;

  destroy$ = new Subject();

  constructor(
    @Inject(HEADER_HEIGHT) public headerHeight,
    private router: Router,
    private readService: ReadService,
    private store: Store
  ) {
    this.handleRouteChanges(); // to get initial routing subscribe in constructor instead of OnInit
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  private handleRouteChanges(): void {
    combineLatest(this.router.events, this.isAppTokenValid$)
      .pipe(
        takeUntil(this.destroy$),
        filter(([event, isValid]) => event instanceof NavigationEnd && isValid),
        map((pair: any[]) => (pair[0] as NavigationEnd).url.replace('/r/', '')),
        tap((subName: string) => this.subName = subName),
      ).subscribe();
  }

  fetchPostsIfNeeded() {
    this.store.dispatch(new SubPostsGetCall(this.subName));
  }
}

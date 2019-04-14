import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Observable, Subject } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Sub, SubGetCall, SubState } from '@web/src/app/sub/sub.store';
import { AuthState } from '@libs/auth/src/lib/auth.store';
import { distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import { ReadService } from '@web/src/app/read.service';
import { tap } from 'rxjs/internal/operators/tap';
import { HEADER_HEIGHT } from '@web/src/app/app.injection-tokens';
import { PostState } from '@web/src/app/sub/post.store';
import { Post } from '@libs/shared-models/src';

@Component({
  selector: 'web-sub',
  template: `
    <ng-template #subredditNotFound>
      <h1>404 - not found</h1>
    </ng-template>
    <ng-container *ngIf="subName">
      <ui-card-scroller
        [sub$]="subsMap$ | activeSub : subName"
        [postsMap$]="postsMap$"
        [offsetTop]="headerHeight"
        (scrollEndReached)="scrollEndReached$.next($event)"
      ></ui-card-scroller>
    </ng-container>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubComponent implements OnInit, OnDestroy {
  @Select(SubState.entitiesMap) subsMap$: Observable<{ [subName: string]: Sub }>;
  @Select(PostState.entitiesMap) postsMap$: Observable<{ [name: string]: Post }>;
  @Select(AuthState.isAppTokenValid) private isAppTokenValid$: Observable<boolean>;
  scrollEndReached$ = new Subject<number>();
  destroy$ = new Subject();
  subName: string;

  constructor(
    @Inject(HEADER_HEIGHT) public headerHeight,
    private router: Router,
    private readService: ReadService,
    private store: Store
  ) {
    // to get initial routing subscribe in constructor instead of OnInit; might not work with SSR though
    this.handleRouteChanges();
  }

  ngOnInit(): void {
    this.handleScrollEndReached();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  private handleRouteChanges(): void {
    combineLatest(this.router.events, this.isAppTokenValid$).pipe(
      takeUntil(this.destroy$),
      filter(([event, isValid]) => event instanceof NavigationEnd && isValid),
      map((pair: any[]) => (pair[0] as NavigationEnd).url.replace('/r/', '')),
      tap((subName: string) => this.subName = subName),
    ).subscribe();
  }

  private handleScrollEndReached(): void {
    this.scrollEndReached$.pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged(),
      tap(() =>  this.store.dispatch(new SubGetCall(this.subName)))
    ).subscribe()
  }
}

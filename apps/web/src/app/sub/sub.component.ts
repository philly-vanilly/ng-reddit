import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
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
    <mat-progress-bar
      *ngIf="(subsMap$ | activeSub : subName | async)?.isLoading"
      mode="query"
      class="web-sub_progress-bar"
    ></mat-progress-bar>
    <ui-card-scroller
      [posts$]="subsMap$ | subsPosts : subName : postsMap$"
      [offsetTop]="headerHeight"
      (scrollEndReached)="scrollEndReached$.next($event)"
    ></ui-card-scroller>
  `,
  styleUrls: ['./sub.component.scss'],
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
    private store: Store,
    private cdr: ChangeDetectorRef
  ) {
    // to get initial routing subscribe in constructor instead of OnInit; might not work with SSR!
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
      tap(() => this.cdr.markForCheck())
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

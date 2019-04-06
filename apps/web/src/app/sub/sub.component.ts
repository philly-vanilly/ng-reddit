import { Component, OnDestroy } from '@angular/core';
import { combineLatest, Observable, Subject } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Sub, SubPostsGetCall, SubState } from '@web/src/app/store/sub.store';
import { AuthState } from '@libs/auth/src/lib/auth.store';
import { filter, map, switchMap } from 'rxjs/operators';
import { SubPost } from '@web/src/app/models/subreddit-listing';
import { ReadService } from '@web/src/app/read.service';
import { PostState } from '@web/src/app/store/post.store';
import { tap } from 'rxjs/internal/operators/tap';

@Component({
  selector: 'web-sub',
  template: `
    <ng-container *ngIf="(filteredPosts$ | async).length > 0">
      <pre *ngFor="let post of (filteredPosts$ | async)">{{ post | json }}</pre>
    </ng-container>
  `,
  styles: [``]
})
export class SubComponent implements OnDestroy {
  @Select(PostState.entities) posts$: Observable<SubPost[]>;
  @Select(SubState.entities) subs$: Observable<Sub[]>;
  @Select(SubState) rnd$: Observable<Sub[]>;
  @Select(AuthState.isAppTokenValid) private isAppTokenValid$: Observable<boolean>;
  filteredPosts$: Observable<SubPost[]>;
  subName: string;

  destroy$ = new Subject();

  constructor(
    private router: Router,
    private readService: ReadService,
    private store: Store
  ) {
    combineLatest(this.router.events, this.isAppTokenValid$)
      .pipe(
        filter(([event, isValid]) => event instanceof NavigationEnd && isValid),
        map((pair: any[]) => (pair[0] as NavigationEnd).url.replace('/r/', '')),
        tap((subName: string) => this.subName = subName),
        tap((subName: string) => this.store.dispatch(new SubPostsGetCall(subName)))
      ).subscribe();

    this.filteredPosts$ = this.subs$.pipe(
      tap(subs => console.log("SUBS " + JSON.stringify(subs))),
      map((subs: Sub[]) => subs.find((sub: Sub) => sub.subName === this.subName)),
      tap(sub => console.log("SUB " + sub)),
      filter((sub: Sub) => !!sub),
      map((sub: Sub) => sub.ids),
      switchMap((ids: string[]) => this.posts$.pipe(
        map((posts: SubPost[]) => posts.filter((post: SubPost) => ids.includes(post.id))) // TODO: instead of filter use sort
      ))
    );
    this.filteredPosts$.subscribe(res => console.log(res));
    // this.rnd$.subscribe(res => console.log(res));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }


}

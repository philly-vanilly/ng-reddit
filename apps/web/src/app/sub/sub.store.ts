import { Action, Select, State, StateContext, Store } from '@ngxs/store';
import { type } from '@libs/utils/src';
import { Post } from '@libs/shared-models/src';
import { ReadService } from '../read.service';
import {
  Add,
  CreateOrReplace,
  defaultEntityState,
  EntityState,
  EntityStateModel,
  IdStrategy,
  Update
} from '@libs/entity/src';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Listing, ListingResponseModel } from '@libs/shared-models/src/lib/listing-response.model';
import { PostState } from '@web/src/app/sub/post.store';
import { Router } from '@angular/router';
import { tap } from 'rxjs/internal/operators/tap';

export class SubPostsGetCall {
  static readonly type = type('[Sub] PostsGetCall');
  constructor(public subName: string,) {}
}

export class SubPostsGetFailure {
  static readonly type = type('[Sub] PostsGetFailure');
  constructor(public error: Error) {}
}

export class SubStylesheetGetCall {
  static readonly type = type('[Sub] StylesheetGetCall');
  constructor(public subName: string) {}
}

export interface Sub {
  subName: string;
  postIDs: string[];
  after: string;
  isLoading: boolean;
  stylesheet?: string;
  images?: any[];
}

@State<EntityStateModel<Sub>>({
  name: 'sub',
  defaults: defaultEntityState()
})
export class SubState extends EntityState<Sub> {
  @Select(SubState.entitiesMap) subs$: Observable<{[name: string] : Sub}>;

  constructor(
    private readService: ReadService,
    private store: Store,
    private router: Router
  ) {
    super(SubState, 'subName', IdStrategy.EntityIdGenerator);
  }

  @Action(SubPostsGetCall) subPostsGetCall(ctx: StateContext<Sub>, { subName }: SubPostsGetCall): void {
    const handleResponse$ = map((lrm: ListingResponseModel) => {
      const listings: Listing[] = lrm.data.children;

      if (!lrm.data.dist && !lrm.data.before && !lrm.data.after && !listings.length) {
        this.router.navigate(['r', 'all']);
        return;
      }

      const posts: Post[] = listings.map((listing: Listing) => (listing.data as Post));
      this.store.dispatch([
        new Update(SubState, (current: Sub) => current.subName === subName, (current: Sub) => {
          return {
            ...current,
            postIDs: [...current.postIDs, ...posts.map((post: Post) => post.name)],
            isLoading: false,
            after: lrm.data.after
          } as Sub;
        }),
        new CreateOrReplace(PostState, posts)
      ]).pipe(tap(() => this.store.dispatch(new SubStylesheetGetCall(subName))));
      }, (error: Error) => ctx.dispatch(new SubPostsGetFailure(error)));

    this.subs$.pipe(take(1)).subscribe(subs => {
      const sub: Sub = subs[subName];
      if (!sub) {
        this.store.dispatch(new Add(SubState, { subName, postIDs: [], after: undefined, isLoading: true}))
          .pipe(mergeMap(() => this.readService.getInitialListing('r', subName, 'new')
            .pipe(handleResponse$))).subscribe();
      } else {
        this.store.dispatch(new Update(SubState, (current: Sub) => current.subName === subName, (current: Sub) => ({...current, isLoading: true})))
          .pipe(mergeMap(() => this.readService.getSubsequentListingFull('r', subName, 'new', sub.after, sub.postIDs.length)
            .pipe(handleResponse$))).subscribe()
      }
    });
  }

  @Action(SubPostsGetFailure) subPostsGetFailure(ctx: StateContext<Sub>, { error } : SubPostsGetFailure): void {
    console.error(error);
  }
}


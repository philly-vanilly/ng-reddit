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

export class SubGetCall {
  static readonly type = type('[Sub] GetCall');
  constructor(public subName: string,) {}
}

export class SubGetFailure {
  static readonly type = type('[Sub] GetFailure');
  constructor(public error: Error) {}
}

export interface Sub {
  subName: string;
  postIDs: string[];
  after: string;
  isLoading: boolean;
}

@State<EntityStateModel<Sub>>({
  name: 'sub',
  defaults: defaultEntityState()
})
export class SubState extends EntityState<Sub> {
  @Select(SubState.entitiesMap) subs$: Observable<{[name: string] : Sub}>;

  constructor(
    private readService: ReadService,
    private store: Store
  ) {
    super(SubState, 'subName', IdStrategy.EntityIdGenerator);
  }

  @Action(SubGetCall) subPostsGetCall(ctx: StateContext<Sub>, { subName }: SubGetCall): void {
    const handleResponse$ = map((lrm: ListingResponseModel) => {
      const listings: Listing[] = lrm.data.children;
      const posts: Post[] = listings.map((listing: Listing) => (listing.data as Post));

      posts.forEach(post => {
        if (post.subreddit !== subName) {
          console.log("EXPECTED " + subName + " BUT GOT " + post.subreddit);
        }
      });

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
      ]);
      }, (error: Error) => ctx.dispatch(new SubGetFailure(error)));

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

  @Action(SubGetFailure) subPostsGetFailure(ctx: StateContext<Sub>, { error } : SubGetFailure): void {
    console.error(error);
  }
}


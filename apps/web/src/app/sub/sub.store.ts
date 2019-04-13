import { Action, Select, State, StateContext, Store } from '@ngxs/store';
import { type } from '@libs/utils/src';
import { Post } from '@libs/shared-models/src';
import { ReadService } from '../read.service';
import { Add, defaultEntityState, EntityState, EntityStateModel, IdStrategy, Update } from '@libs/entity/src';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Listing, ListingResponseModel } from '@libs/shared-models/src/lib/listing-response.model';

export class SubPostsGetCall {
  static readonly type = type('[Post] GetCall');
  constructor(public subName: string,) {}
}

export class SubPostsGetFailure {
  static readonly type = type('[Post] GetFailure');
  constructor(public error: Error) {}
}

export interface Sub {
  subName: string;
  postIDs: string[];
  after: string;
  isLoading: boolean;
}

@State<EntityStateModel<Sub>>({
  name: 'post',
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

  @Action(SubPostsGetCall) subPostsGetCall(ctx: StateContext<Sub>, { subName }: SubPostsGetCall): void {
    const handleResponse$ = map((lrm: ListingResponseModel) => {
        const listings: Listing[] = lrm.data.children;
        this.store.dispatch(new Update(SubState, (sub: Sub) => sub.subName === subName, (sub: Sub) => {
          return {
            ...sub,
            postIDs: [...sub.postIDs, ...listings.map((listing: Listing) => (listing.data as Post).name)],
            isLoading: false,
            after: lrm.data.after
          } as Sub;
        }));
      },
      (error: Error) => ctx.dispatch(new SubPostsGetFailure(error)));

    this.subs$.pipe(take(1)).subscribe(subs => {
      const sub: Sub = subs[subName];
      if (!sub) {
        this.store.dispatch(new Add(SubState, { subName, postIDs: [], after: undefined, isLoading: false}))
          .pipe(mergeMap(() => this.readService.getInitialListing('r', subName, 'new')
            .pipe(handleResponse$))).subscribe()
      } else {
        this.readService.getSubsequentListing(sub.after, sub.postIDs.length).pipe(handleResponse$).subscribe()
      }
    });
  }

  @Action(SubPostsGetFailure) subPostsGetFailure(ctx: StateContext<Sub>, { error } : SubPostsGetFailure): void {
    console.error(error);
  }
}


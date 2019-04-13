import { Action, Select, State, StateContext, Store } from '@ngxs/store';
import { type } from '@libs/utils/src';
import { Post } from '@libs/shared-models/src';
import { ReadService } from '../read.service';
import { Add, defaultEntityState, EntityState, EntityStateModel, IdStrategy, Update } from '@libs/entity/src';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

export class SubPostsGetCall {
  static readonly type = type('[Post] GetCall');
  constructor(public subName: string,) {}
}

export class SubPostsGetSuccess {
  static readonly type = type('[Post] GetSuccess');
  constructor(public nameAndPosts: {subName: string; posts: Post[];}){}
}

export class SubPostsGetFailure {
  static readonly type = type('[Post] GetFailure');
  constructor(public error: Error) {}
}

export interface Sub {
  subName: string;
  posts: Post[];
  after: string;
  isLoading: boolean;
}

@State<EntityStateModel<Sub>>({
  name: 'post',
  defaults: defaultEntityState()
  // FROM DEFAULT:
  // entities: {},
  // ids: [],
  // loading: false,
  // error: undefined,
  // active: undefined,
  // pageSize: 10,
  // pageIndex: 0,
  // lastUpdated: Date.now(),
})
export class SubState extends EntityState<Sub> {
  // @Select(SubState.size) count$: Observable<number>;
  @Select(SubState.entitiesMap) subs$: Observable<{[name: string] : Sub}>;

  // @Select(SubState.active) active$: Observable<Sub>;
  // @Select(SubState.activeId) activeId$: Observable<string>;
  // @Select(SubState.keys) keys$: Observable<string[]>;
  // @Select(SubState.loading) loading$: Observable<boolean>;
  // @Select(SubState.error) error$: Observable<Error | undefined>;
  // @Select(SubState.latestId) latestId$: Observable<string>;
  // @Select(SubState.latest) latest$: Observable<Sub>;

  constructor(
    private readService: ReadService,
    private store: Store
  ) {
    super(SubState, 'subName', IdStrategy.EntityIdGenerator);
  }

  @Action(SubPostsGetCall) subPostsGetCall(ctx: StateContext<Sub>, { subName }: SubPostsGetCall): void {
    const getInitial$ = this.readService.getInitialListing('r', subName, 'new').pipe(map(
      (posts: Post[]) => ctx.dispatch(new SubPostsGetSuccess({ subName, posts })),
      (error: Error) => ctx.dispatch(new SubPostsGetFailure(error)))
    );

    this.subs$.pipe(take(1)).subscribe(subs => {
      const sub: Sub = subs[subName];
      if (!sub) {
        this.store.dispatch(new Add(SubState, { subName, posts: [], after: undefined, isLoading: false}))
          .pipe(mergeMap(() => getInitial$)).subscribe()
      } else {
        console.log(Object.keys(sub));
        this.readService.getSubsequentListing(sub.after, Object.keys(sub.posts).length).pipe(map(
          (posts: Post[]) => ctx.dispatch(new SubPostsGetSuccess({ subName, posts })),
          (error: Error) => ctx.dispatch(new SubPostsGetFailure(error)))
        ).subscribe()
      }
    });
  }

  @Action(SubPostsGetSuccess) subPostsGetSuccess(ctx: StateContext<Sub>, { nameAndPosts } : SubPostsGetSuccess): void {
    const { subName, posts } = nameAndPosts;
    this.store.dispatch(new Update(
      SubState,
      (sub: Sub) => sub.subName === subName,
      (sub: Sub) => {
        sub.posts.forEach(existingPost => {
          if (posts.find(newPost => newPost.id === existingPost.id)) {
            throw new Error(`The post with the id ${existingPost.id} already exists!`);
          }
        });
        return {...sub, posts: [...sub.posts, ...posts], isLoading: false,  };
      }
    ));
  }

  @Action(SubPostsGetFailure) subPostsGetFailure(ctx: StateContext<Sub>, { error } : SubPostsGetFailure): void {
    console.error(error);
  }
}


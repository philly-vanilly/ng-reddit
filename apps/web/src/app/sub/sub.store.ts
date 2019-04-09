import { Action, State, StateContext, Store } from '@ngxs/store';
import { type } from '@libs/utils/src';
import { Post } from '@libs/shared-models/src';
import { ReadService } from '../read.service';
import { Add, defaultEntityState, EntityState, EntityStateModel, IdStrategy, Update } from '@libs/entity/src';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';

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
  // @Select(SubState.entities) toDos$: Observable<Sub[]>;
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
    // if (this.store.selectSnapshot<SubState>(subState => subState.))
    this.store.dispatch(new Add(SubState, { subName, posts: []})).pipe(
      mergeMap(() => this.readService.getSubreddit(subName))
    ).subscribe(
      (posts: Post[]) => ctx.dispatch(new SubPostsGetSuccess({ subName, posts })),
      (error: Error) => ctx.dispatch(new SubPostsGetFailure(error)));
  }

  @Action(SubPostsGetSuccess) subPostsGetSuccess(ctx: StateContext<Sub>, { nameAndPosts } : SubPostsGetSuccess): void {
    const { subName, posts } = nameAndPosts;
    this.store.dispatch(new Update(
      SubState,
      (sub: Sub) => sub.subName === subName,
      (sub: Sub) => ({...sub, posts: [...sub.posts, ...posts]})
    ));
  }

  @Action(SubPostsGetFailure) subPostsGetFailure(ctx: StateContext<Sub>, { error } : SubPostsGetFailure): void {
    console.error(error);
  }
}


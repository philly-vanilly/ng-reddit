import { Action, Select, State, StateContext } from '@ngxs/store';
import { type } from '@libs/utils/src';
import { SubPost } from '../models/subreddit-listing';
import { ReadService } from '../read.service';
import { Add, CreateOrReplace, defaultEntityState, EntityState, EntityStateModel, IdStrategy } from '@libs/entity/src';
import { Observable } from 'rxjs';
import { PostState } from '@web/src/app/store/post.store';
import { ToDo, TodoState } from '@libs/entity/integration/app/store/todo';

export class SubPostsGetCall {
  static readonly type = type('[Sub] PostsGetCall');
  constructor(public subName: string) {}
}

export class SubPostsGetSuccess {
  static readonly type = type('[Sub] PostsGetSuccess');
  constructor(public payload: {subName: string; posts: SubPost[];}){}
}

export class SubPostsGetFailure {
  static readonly type = type('[Sub] PostsGetFailure');
}

export interface Sub {
  link: string;
  isLoading: boolean;
  isActive: boolean;
  // ids: string[];
}

@State<EntityStateModel<Sub>>({
  name: 'sub',
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
    private readService: ReadService
  ) {
    super(SubState, 'link', IdStrategy.EntityIdGenerator);
  }

  @Action(SubPostsGetCall) subPostsGetCall(ctx: StateContext<Sub>, { subName }: SubPostsGetCall): void {
  this.readService.getSubreddit(subName).subscribe(
    (posts: SubPost[]) => { ctx.dispatch([
      // new SubPostsGetSuccess({ subName, posts })
      new CreateOrReplace<SubPost>(PostState, posts)
    ]);},
    (error: Error) => { ctx.dispatch(new SubPostsGetFailure()); },
    () => {})
  }

  @Action(SubPostsGetSuccess) subPostsGetSuccess(ctx: StateContext<Sub>, { payload } : SubPostsGetSuccess): void {
    const { subName, posts } = payload;
    console.log(posts);
    const sub: Sub = {
      link: 'peter',
      isLoading: false,
      isActive: true,
      // ids: posts.map((post: SubPost) => post.id)
    };
    // const todo: ToDo = {
    //   description: subName,
    //   title: subName,
    //   done: true
    // }
    ctx.dispatch([
      // new CreateOrReplace(SubState, sub)
      new Add(PostState, posts)
    ]);
  }
}


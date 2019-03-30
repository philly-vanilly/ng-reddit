import { Action, Selector, State, StateContext } from '@ngxs/store';
import { type } from '@libs/utils/src';
import { SubPost } from '../models/subreddit-listing.model';
import { ReadService } from '../read.service';

export class SubPostsGetCall {
  static readonly type = type('[Sub] PostsGetCall');
  constructor(public payload: string) {}
}

export class SubPostsGetSuccess {
  static readonly type = type('[Sub] PostsGetSuccess');
  constructor(public payload: SubPost[]) {}
}

export interface SubStateModel {
  name: string;
  posts: SubPost[];
}

@State<SubStateModel>({
  name: 'sub',
  defaults: {
    name: undefined,
    posts: []
  }
})
export class SubState {
  @Selector() static doAnyExist(state: SubStateModel): boolean {
    return state.posts.length > 0;
  }

  @Selector() static videos(state: SubStateModel): SubPost[] {
    return state.posts.filter((sub: SubPost) => sub.is_video);
  }

  constructor(
    private readService: ReadService
  ) {}

  @Action(SubPostsGetCall) subPostsGetCall(ctx: StateContext<SubStateModel>, { payload }: SubPostsGetCall): void {
    this.readService.getSubreddit(payload).subscribe((subs: SubPost[]) => {
      ctx.dispatch(new SubPostsGetSuccess(subs));
    });
  }

  @Action(SubPostsGetSuccess) subPostsGetSuccess(ctx: StateContext<SubStateModel>, { payload }: SubPostsGetSuccess): void {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      posts: [...state.posts, ...payload]
    });
  }

}

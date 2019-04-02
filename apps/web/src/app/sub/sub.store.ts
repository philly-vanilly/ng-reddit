import { Action, State, StateContext } from '@ngxs/store';
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
  [id:string]: {
    subreddit: string;
    user: string;
    posts: SubPost[];
  };
}

@State<SubStateModel>({
  name: 'sub',
  defaults: {}
})
export class SubState {
  // @Selector() static doAnyExist(state: SubStateModel): boolean {
  //   return Object.keys(state).length > 0;
  // }
  //
  // @Selector() static videos(state: SubStateModel): SubPost[] {
  //   return state.posts.filter((sub: SubPost) => sub.is_video);
  // }

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
    payload.forEach((subPost: SubPost) => {
      const id = subPost.id;
      ctx.patchState({
        id: {
          subreddit: undefined,
          user: undefined,
          posts: undefined
        }
      });
    });

  }

}

import { defaultEntityState, EntityState, EntityStateModel, IdStrategy } from '@libs/entity/src';

import { Post } from '@libs/shared-models/src';
import { State } from '@ngxs/store';

// export class SubPostsGetFailure {
//   static readonly type = type('[Post] GetFailure');
//   constructor(public error: Error) {}
// }

@State<EntityStateModel<Post>>({
  name: 'post',
  defaults: defaultEntityState()
})
export class PostState extends EntityState<Post> {
  constructor() {
    super(PostState, 'name', IdStrategy.EntityIdGenerator);
  }
}

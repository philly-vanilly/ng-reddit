import { State } from '@ngxs/store';
import { defaultEntityState, EntityState, EntityStateModel, IdStrategy } from '@libs/entity/src';
import { SubPost } from '@web/src/app/models/subreddit-listing';

@State<EntityStateModel<SubPost>>({
  name: 'post',
  defaults: defaultEntityState()
})
export class PostState extends EntityState<SubPost> {
  constructor() {
    super(PostState, 'id', IdStrategy.EntityIdGenerator);
  }
}

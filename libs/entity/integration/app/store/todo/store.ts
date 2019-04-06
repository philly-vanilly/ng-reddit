import { State } from '@ngxs/store';
import { defaultEntityState, EntityState, EntityStateModel, IdStrategy } from '../../../../../entity/src';

export interface ToDo {
  title: string;
  description: string;
  done: boolean;
}

@State<EntityStateModel<ToDo>>({
  name: 'todo',
  defaults: defaultEntityState()
})
export class TodoState extends EntityState<ToDo> {
  constructor() {
    super(TodoState, 'title', IdStrategy.EntityIdGenerator);
  }
}

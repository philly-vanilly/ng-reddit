import { Pipe, PipeTransform } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { Sub } from '@web/src/app/sub/sub.store';
import { map } from 'rxjs/operators';
import { Post } from '@libs/shared-models/src';

@Pipe({
  name: 'subsPosts'
})
export class SubsPostsPipe implements PipeTransform {
  transform(subs$: Observable<{ [name: string]: Sub }>, subName: string, posts$: Observable<{ [name: string]: Post }>): Observable<Post[]> {
    return combineLatest(subs$, posts$).pipe(
        map((pair: any[]) => {
          const subsMap: { [name: string]: Sub } = pair[0];
          const postsMap: { [name: string]: Post } = pair[1];
          const sub: Sub = subsMap[subName];
          if (sub) {
            return sub.postIDs.map((postID: string) => postsMap[postID])
          }
          return [];
        })
    )
  }
}

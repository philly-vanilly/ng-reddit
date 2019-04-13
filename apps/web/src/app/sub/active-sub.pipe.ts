import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { Sub } from '@web/src/app/sub/sub.store';
import { map } from 'rxjs/operators';

@Pipe({
  name: 'activeSub'
})
export class ActiveSubPipe implements PipeTransform {
  transform(subs$: Observable<{ [name: string]: Sub }>, subName: string): Observable<Sub> {
    return subs$.pipe(map((subsMap: { [name: string]: Sub }) => subsMap[subName]));
  }
}

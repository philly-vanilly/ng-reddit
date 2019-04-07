import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { Sub } from '@web/src/app/sub/sub.store';
import { map } from 'rxjs/operators';

@Pipe({
  name: 'activeSub'
})
export class ActiveSubPipe implements PipeTransform {
  transform(subs$: Observable<Sub[]>, subName: string): any {
    return subs$.pipe(map((subs: Sub[]) => subs ? subs.find((sub: Sub) => sub.subName === subName) : 'nothing'));
  }

}

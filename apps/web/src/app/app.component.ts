import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ReadService } from '@web/src/app/read.service';
import { Router } from '@angular/router';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { HeaderAutocompleteOptions } from '@libs/ui/organism/ui-mat-header/src';

@Component({
  selector: 'web-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnDestroy {
  autocompleteOptions$ = new BehaviorSubject<HeaderAutocompleteOptions[]>([]);
  private destroy$ = new Subject();

  constructor(
    public readService: ReadService,
    private router: Router
  ) {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  headerInputModelChange(inputModel: string) {
    this.readService.getAutocomplete(inputModel)
      .pipe(debounceTime(100), takeUntil(this.destroy$))
      .subscribe((res: HeaderAutocompleteOptions[]) => this.autocompleteOptions$.next(res));
  }

  headerInputFormSubmit(term: string) {
    const subPath: string[] = term.split('/').filter(el => el !== '');
    this.router.navigate(subPath);
  }
}

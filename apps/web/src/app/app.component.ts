import { ChangeDetectionStrategy, Component, Inject, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ReadService } from '@web/src/app/read.service';
import { Router } from '@angular/router';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { HeaderAutocompleteOptions } from '@libs/ui/organism/ui-mat-header/src';
import { UserLoginCall } from '@libs/auth/src';
import { Store } from '@ngxs/store';
import { HEADER_HEIGHT } from '@web/src/app/app.injection-tokens';

@Component({
  selector: 'web-app',
  template: `
  <ui-mat-header
    (inputModelChange)="headerInputModelChange($event)"
    (formSubmit)="headerInputFormSubmit($event)"
    (userButtonClicked)="userButtonClicked()"
    [autocompleteOptions$]="autocompleteOptions$"
   ></ui-mat-header>
  <div [style.height.px]="headerHeight"></div>
  <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnDestroy {
  autocompleteOptions$ = new BehaviorSubject<HeaderAutocompleteOptions[]>([]);
  private destroy$ = new Subject();

  constructor(
    @Inject(HEADER_HEIGHT) public headerHeight,
    public readService: ReadService,
    private router: Router,
    private store: Store
  ) {}

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

  userButtonClicked() {
    this.store.dispatch(new UserLoginCall());
  }
}

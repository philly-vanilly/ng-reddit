import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { ReadService } from './read.service';

@Component({
  selector: 'web-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  form: FormGroup;
  term = new FormControl('', Validators.required);
  options$ = new BehaviorSubject<string[]>([]);
  destroy$ = new Subject();

  constructor(
    private fb: FormBuilder,
    public readService: ReadService,
    private router: Router
  ) {
    this.form = fb.group({
      term: this.term
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  onInputModelChange(): void {
    this.readService.getAutocomplete(this.form.value.term)
      .pipe(
        debounceTime(100),
        takeUntil(this.destroy$)
      )
      .subscribe((res: string[]) => this.options$.next(res));
  }

  onFormSubmit(): void {
    const subPath: string[] = (this.form.value.term as string).split('/').filter(el => el !== '');
    this.router.navigate(subPath);
  }
}

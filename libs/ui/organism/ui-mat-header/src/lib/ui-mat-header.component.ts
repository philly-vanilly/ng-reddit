import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { HeaderAutocompleteOptions } from '@libs/ui/organism/ui-mat-header/src';

@Component({
  selector: 'ui-mat-header',
  template: `
    <mat-toolbar role="heading">
      <mat-toolbar-row>
        <button class="ui-mat-header_app-button" mat-flat-button disableRipple routerLink="/">
          <mat-icon aria-hidden="false" aria-label="App icon">accessible_forward</mat-icon>
          <span class="ui-mat-header_app-button-text">{{ documentTitle }}</span>
        </button>
        <form
          class="ui-mat-header_search-form-wrapper"
          [formGroup]="form"
          (ngSubmit)="formSubmit.emit(form.value.term)"
        >
          <mat-form-field>
            <mat-label>Subreddit or User</mat-label>
            <input
              matInput
              [formControl]="term"
              [matAutocomplete]="auto"
              (ngModelChange)="inputModelChange.emit($event)"
            >
            <mat-autocomplete #auto="matAutocomplete">
              <mat-option
                [class.ui-mat-header_options--is-user]="option.isUser"
                *ngFor="let option of autocompleteOptions$ | async"
                [value]="option.value">{{option.value}}
              </mat-option>
            </mat-autocomplete>
          </mat-form-field>
        </form>
        <button class="ui-mat-header_user-button" mat-button>Login</button>
      </mat-toolbar-row>
    </mat-toolbar>
  `,
  styleUrls: ['./ui-mat-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiMatHeaderComponent {
  @Input() autocompleteOptions$: Observable<HeaderAutocompleteOptions>;
  @Output() inputModelChange = new EventEmitter<string>();
  @Output() formSubmit = new EventEmitter<any>();

  get documentTitle(): string { return document.title; }

  form: FormGroup;
  term = new FormControl('', Validators.required);

  constructor(private fb: FormBuilder) {
    this.form = fb.group({
      term: this.term
    });
  }
}

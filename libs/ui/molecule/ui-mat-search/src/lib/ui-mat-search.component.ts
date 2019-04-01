import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { HeaderAutocompleteOptions } from '@libs/ui/organism/ui-mat-header/src';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ui-mat-search',
  template: `
    <form
      class="ui-mat-search_form"
      [formGroup]="form"
      (ngSubmit)="formSubmit.emit(form.value.term)"
    >
      <mat-form-field appearance="outline">
        <input 
          matInput
          type="search"
          [height]="35"
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
  `,
  styleUrls: ['./ui-mat-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiMatSearchComponent {
  @Input() autocompleteOptions$: Observable<HeaderAutocompleteOptions>;
  @Output() inputModelChange = new EventEmitter<string>();
  @Output() formSubmit = new EventEmitter<any>();

  form: FormGroup;
  term = new FormControl('', Validators.required);

  constructor(private fb: FormBuilder) {
    this.form = fb.group({
      term: this.term
    });
  }
}

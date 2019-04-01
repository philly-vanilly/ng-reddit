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
          [formControl]="term"
          [matAutocomplete]="auto"
          (ngModelChange)="inputModelChange.emit($event)"
        >
        <span matPrefix>/r/all/</span>
        <mat-button-toggle-group matSuffix #group="matButtonToggleGroup">
          <mat-button-toggle value="left" aria-label="Text align left">
            <mat-icon>format_align_left</mat-icon>
          </mat-button-toggle>
          <mat-button-toggle value="center" aria-label="Text align center">
            <mat-icon>format_align_center</mat-icon>
          </mat-button-toggle>
          <mat-button-toggle value="right" aria-label="Text align right">
            <mat-icon>format_align_right</mat-icon>
          </mat-button-toggle>
          <mat-button-toggle value="justify" disabled aria-label="Text align justify">
            <mat-icon>format_align_justify</mat-icon>
          </mat-button-toggle>
        </mat-button-toggle-group>
<!--        <button mat-icon-button matSuffix>-->
<!--          <mat-icon>search</mat-icon>-->
<!--        </button>-->
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

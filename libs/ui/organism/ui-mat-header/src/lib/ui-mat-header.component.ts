import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { HeaderAutocompleteOptions } from '@libs/ui/organism/ui-mat-header/src';

@Component({
  selector: 'ui-mat-header',
  template: `
    <mat-toolbar role="heading" class="mat-elevation-z5">
      <mat-toolbar-row>
        <button class="ui-mat-header_app-button" mat-flat-button disableRipple routerLink="/">
          <mat-icon color="warn">accessible_forward</mat-icon>
          <span class="ui-mat-header_app-button-text">{{ documentTitle }}</span>
        </button>
        <ui-mat-search
          class="ui-mat-header_search"
          [autocompleteOptions$]="autocompleteOptions$"
          (inputModelChange)="inputModelChange.emit($event)"
          (formSubmit)="formSubmit.emit($event)"
        ></ui-mat-search>
        <button class="ui-mat-header_user-button" mat-button>{{ (user$ | async) ? (user$ | async).name : 'Login' }}</button>
      </mat-toolbar-row>
    </mat-toolbar>
  `,
  styleUrls: ['./ui-mat-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiMatHeaderComponent {
  @Input() user$: Observable<any>;
  @Input() autocompleteOptions$: Observable<HeaderAutocompleteOptions>;
  @Output() inputModelChange = new EventEmitter<string>();
  @Output() formSubmit = new EventEmitter<any>();

  get documentTitle(): string { return document.title; }
}

import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { HeaderAutocompleteOptions } from '@libs/ui/organism/ui-mat-header/src';

@Component({
  selector: 'ui-mat-header',
  templateUrl: './ui-mat-header.component.html',
  styleUrls: ['./ui-mat-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiMatHeaderComponent {
  @Input() autocompleteOptions$: Observable<HeaderAutocompleteOptions>;
  @Output() inputModelChange = new EventEmitter<string>();
  @Output() formSubmit = new EventEmitter<any>();
  @Output() userButtonClicked = new EventEmitter<any>();
  @Output() tabsButtonClicked = new EventEmitter<any>();

  get documentTitle(): string { return document.title; }
}

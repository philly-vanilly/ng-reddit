import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { Observable } from 'rxjs';
import { HeaderAutocompleteOptions } from '@libs/ui/organism/ui-mat-header/src';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ui-bootstrap-search',
  templateUrl: './ui-bootstrap-search.component.html',
  styleUrls: ['./ui-bootstrap-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // TODO: change to ShadowDom when this issue is fixed: https://github.com/angular/material2/issues/15606
})
export class UiBootstrapSearchComponent {
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

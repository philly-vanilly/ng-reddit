import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { Observable } from 'rxjs';
import { HeaderAutocompleteOptions } from '@libs/ui/organism/ui-mat-header/src';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ui-bootstrap-search',
  template: `
    <div class="input-group">
      <div class="input-group-prepend">
        <span class="input-group-text" id="basic-addon1">/r/all/</span>
      </div>
      <input type="text" class="form-control" placeholder="Recipient's username" aria-label="Recipient's username"
             aria-describedby="basic-addon2">
      <div class="input-group-append">
        <div matRipple>
          <span class="input-group-text" id="basic-addon2">
            <mat-icon>search</mat-icon>
          </span>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./ui-bootstrap-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom // otherwise bootstrap styles escape to the rest of the app
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

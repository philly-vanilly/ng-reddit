import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiBootstrapSearchComponent } from './ui-bootstrap-search.component';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatIconModule,
  MatInputModule, MatRippleModule
} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { A11yModule } from '@angular/cdk/a11y';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatInputModule,
    MatAutocompleteModule,
    MatRippleModule,
    A11yModule
  ],
  declarations: [UiBootstrapSearchComponent],
  exports: [UiBootstrapSearchComponent]
})
export class UiBootstrapSearchModule {}

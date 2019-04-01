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

@NgModule({
  imports: [
    CommonModule,
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatInputModule,
    MatAutocompleteModule,
    MatRippleModule
  ],
  declarations: [UiBootstrapSearchComponent],
  exports: [UiBootstrapSearchComponent]
})
export class UiBootstrapSearchModule {}

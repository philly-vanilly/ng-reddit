import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiBootstrapSearchComponent } from './ui-bootstrap-search.component';
import {
  MatAutocompleteModule,
  MatIconModule,
  MatInputModule
} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatAutocompleteModule,
  ],
  declarations: [UiBootstrapSearchComponent],
  exports: [UiBootstrapSearchComponent]
})
export class UiBootstrapSearchModule {}

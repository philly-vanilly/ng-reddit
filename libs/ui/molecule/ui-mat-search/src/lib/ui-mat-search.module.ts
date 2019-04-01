import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiMatSearchComponent } from './ui-mat-search.component';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule, MatButtonModule,
  MatButtonToggleModule,
  MatIconModule,
  MatInputModule
} from '@angular/material';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatInputModule,
    MatAutocompleteModule
  ],
  declarations: [UiMatSearchComponent],
  exports: [UiMatSearchComponent]
})
export class UiMatSearchModule {}

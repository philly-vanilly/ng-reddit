import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiMatHeaderComponent } from './ui-mat-header.component';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatIconModule,
  MatInputModule,
  MatToolbarModule
} from '@angular/material';
import { RouterModule } from '@angular/router';

export interface HeaderAutocompleteOptions {
  value: string;
  isUser: boolean;
}

@NgModule({
  imports: [
    CommonModule,

    // For search
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatAutocompleteModule,

    // For login
    MatButtonModule,
    RouterModule
  ],
  declarations: [UiMatHeaderComponent],
  exports: [UiMatHeaderComponent]
})
export class UiMatHeaderModule {}

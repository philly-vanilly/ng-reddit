import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiMatHeaderComponent } from './ui-mat-header.component';
import {
  MatButtonModule,
  MatIconModule, MatToolbarModule
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { UiMatSearchModule } from '@libs/ui/molecule/ui-mat-search/src';

export interface HeaderAutocompleteOptions {
  value: string;
  isUser: boolean;
}

@NgModule({
  imports: [
    CommonModule,
    MatToolbarModule,
    // For app-button
    MatIconModule,
    // For search
    UiMatSearchModule,
    // For login
    MatButtonModule,
    RouterModule
  ],
  declarations: [UiMatHeaderComponent],
  exports: [UiMatHeaderComponent]
})
export class UiMatHeaderModule {}

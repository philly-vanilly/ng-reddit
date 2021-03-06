import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiMatHeaderComponent } from './ui-mat-header.component';
import {
  MatButtonModule,
  MatIconModule, MatToolbarModule
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { UiMatSearchModule } from '@libs/ui/molecule/ui-mat-search/src';
import { UiBootstrapSearchModule } from '@libs/ui/molecule/ui-bootstrap-search/src';
import { AccountListingChild, LinkListingChild } from '@libs/shared-models/src';

export interface HeaderAutocompleteOptions {
  isUser: boolean;
  data: LinkListingChild | AccountListingChild;
}

@NgModule({
  imports: [
    CommonModule,
    MatToolbarModule,
    // For app-button
    MatIconModule,
    // For search
    // UiMatSearchModule,
    UiBootstrapSearchModule,
    // For login
    MatButtonModule,
    RouterModule
  ],
  declarations: [UiMatHeaderComponent],
  exports: [UiMatHeaderComponent]
})
export class UiMatHeaderModule {}
